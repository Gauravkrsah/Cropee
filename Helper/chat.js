import { wsClient } from './realtimeSocket.js';

const GEMINI_API_KEY = 'AIzaSyAj0IlBxZUnskZLEvmzZUQQLObMRqGiJjE';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

class ChatManager {
    constructor() {
        this.messages = [];
        this.suggestions = [];
        this.isGenerating = false;
        this.suggestionTimeout = null;
    }

    // Initialize farming-specific suggestions
    getFarmingSuggestions(query) {
        const q = query.toLowerCase();
        if (q.includes('crop') || q.includes('grow')) {
            return [
                'Best soil conditions',
                'Watering schedule',
                'Growing season',
                'Pest control methods',
                'Fertilizer requirements'
            ].map(suffix => `${query} ${suffix.toLowerCase()}`);
        }
        return [];
    }

    async init() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.searchWrapper = document.querySelector('.search-input-wrapper');
        this.suggestionsContainer = document.createElement('div');
        this.suggestionsContainer.className = 'suggestions-container hidden';
        this.searchWrapper.parentNode.insertBefore(this.suggestionsContainer, this.searchWrapper.nextSibling);

        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize UI
        this.sendButton.disabled = true;
        
        // Load saved messages
        await this.loadMessages();
    }

    setupEventListeners() {
        this.chatInput.addEventListener('input', this.handleInput.bind(this));
        this.chatInput.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.sendButton.addEventListener('click', this.handleSend.bind(this));
        
        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchWrapper.contains(e.target)) {
                this.suggestionsContainer.classList.add('hidden');
            }
        });
    }

    handleInput(e) {
        const value = e.target.value;
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = this.chatInput.scrollHeight + 'px';
        
        if (value.trim()) {
            this.searchWrapper.classList.add('typing');
            this.sendButton.disabled = false;
            this.debounceGetSuggestions(value);
        } else {
            this.searchWrapper.classList.remove('typing');
            this.sendButton.disabled = true;
            this.suggestionsContainer.classList.add('hidden');
        }
    }

    debounceGetSuggestions(value) {
        if (this.suggestionTimeout) {
            clearTimeout(this.suggestionTimeout);
        }

        this.suggestionTimeout = setTimeout(() => {
            const suggestions = this.getFarmingSuggestions(value);
            this.showSuggestions(suggestions);
        }, 300);
    }

    showSuggestions(suggestions) {
        if (!suggestions.length) {
            this.suggestionsContainer.classList.add('hidden');
            return;
        }

        this.suggestionsContainer.innerHTML = suggestions
            .map(suggestion => `
                <div class="suggestion-item">
                    <span>${suggestion}</span>
                    <span class="suggestion-arrow">↑</span>
                </div>
            `).join('');

        this.suggestionsContainer.classList.remove('hidden');

        // Add click handlers to suggestions
        this.suggestionsContainer.querySelectorAll('.suggestion-item').forEach((item, i) => {
            item.addEventListener('click', () => {
                this.chatInput.value = suggestions[i];
                this.suggestionsContainer.classList.add('hidden');
                this.chatInput.focus();
            });
        });
    }

    async handleSend() {
        if (this.isGenerating || !this.chatInput.value.trim()) return;
        const userMessage = this.chatInput.value.trim();
        this.appendMessage(userMessage, 'user', true);
        this.saveMessage(userMessage, 'user');
        this.chatInput.value = '';
        this.chatInput.style.height = 'auto';
        this.searchWrapper.classList.remove('typing');
        this.sendButton.disabled = true;
        
        const assistantMessage = this.appendMessage('', 'assistant', false);
        const typingIndicator = assistantMessage.querySelector('.message-typing');
        typingIndicator.classList.remove('hidden');
        this.isGenerating = true;

        // 1. Attempt WebSocket approach first
        let gotWsResponse = false;
        wsClient.sendMessage({
            type: 'userMessage',
            text: userMessage
        });

        // Temporary listener
        const wsListener = async (data) => {
            if (data.type === 'partialResponse') {
                gotWsResponse = true;
                const messageText = assistantMessage.querySelector('.message-text');
                messageText.textContent = data.content || '';
                this.scrollToBottom();
            } else if (data.type === 'finalResponse') {
                gotWsResponse = true;
                typingIndicator.classList.add('hidden');
                const messageText = assistantMessage.querySelector('.message-text');
                await this.typeMessage(messageText, data.content || '');
                this.saveMessage(data.content, 'assistant');
                this.isGenerating = false;
                // Stop listening once we have final response
                wsClient.onMessageReceived = null;
                this.scrollToBottom();
            } else if (data.type === 'error') {
                gotWsResponse = true;
                console.error(data.message);
                const messageText = assistantMessage.querySelector('.message-text');
                messageText.textContent = "Error. Please try again.";
                typingIndicator.classList.add('hidden');
                this.isGenerating = false;
                // Stop listening on error
                wsClient.onMessageReceived = null;
            }
        };

        wsClient.onMessageReceived = wsListener;

        // 2. Fallback to direct fetch if no response after delay
        setTimeout(async () => {
            if (!gotWsResponse) {
                console.warn('No WebSocket response, falling back to fetch...');
                wsClient.onMessageReceived = null; 
                try {
                    const res = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            prompt: {
                                text: `You are CropSay, an agricultural AI assistant. Provide a helpful response about: ${userMessage}`
                            },
                            temperature: 0.7,
                            top_k: 40,
                            top_p: 0.95,
                            max_output_tokens: 1024
                        })
                    });
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    const data = await res.json();
                    if (data.candidates && data.candidates[0].output) {
                        typingIndicator.classList.add('hidden');
                        const messageText = assistantMessage.querySelector('.message-text');
                        await this.typeMessage(messageText, data.candidates[0].output);
                        this.saveMessage(data.candidates[0].output, 'assistant');
                    } else {
                        throw new Error('Invalid response format');
                    }
                } catch (err) {
                    console.error(err);
                    const messageText = assistantMessage.querySelector('.message-text');
                    messageText.textContent = "I’m sorry, but I ran into an error. Please try again.";
                    typingIndicator.classList.add('hidden');
                }
                this.isGenerating = false;
                this.scrollToBottom();
            }
        }, 1500);
    }

    appendMessage(text, sender, animate = true) {
        const template = document.getElementById('message-template');
        const messageDiv = template.content.cloneNode(true).querySelector('.message');
        
        messageDiv.classList.add(sender);
        if (animate) {
            messageDiv.classList.add('animate-in');
        }
        
        const messageText = messageDiv.querySelector('.message-text');
        if (sender === 'user') {
            messageText.textContent = text;
        }
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        return messageDiv;
    }

    async typeMessage(element, text) {
        const words = text.split(' ');
        element.textContent = '';
        
        for (let i = 0; i < words.length; i++) {
            element.textContent += words[i] + ' ';
            await new Promise(resolve => setTimeout(resolve, 30));
            this.scrollToBottom();
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    saveMessage(text, sender) {
        this.messages.push({ text, sender, timestamp: new Date().toISOString() });
        localStorage.setItem('chatHistory', JSON.stringify(this.messages));
    }
}

// Add to your existing styles
document.head.insertAdjacentHTML('beforeend', `
<style>
.suggestions-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #2A2A2A;
    border: 1px solid rgba(255,255,255,0.1);
    border-top: none;
    border-radius: 0 0 12px 12px;
    overflow: hidden;
    z-index: 1000;
}

.suggestions-container.hidden {
    display: none;
}

.suggestion-item {
    padding: 12px 16px;
    color: #ECECF1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.suggestion-item:hover {
    background: rgba(255,255,255,0.1);
}

.suggestion-arrow {
    color: rgba(255,255,255,0.3);
}
</style>
`);

// Initialize chat on page load
document.addEventListener('DOMContentLoaded', () => {
    const chatManager = new ChatManager();
    chatManager.init();
});
