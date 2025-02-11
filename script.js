document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const mobileMenuButton = document.querySelector('.mobile-header .menu-button');
    const sidebarMenuButton = document.querySelector('.sidebar .menu-button');
    const sidebarToggleButton = document.getElementById('sidebarToggleButton');
    const newChatButton = document.getElementById('newChatButton');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Function to toggle sidebar
    function toggleSidebar() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            sidebar.classList.toggle('mobile-open');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
            
            // Ensure overlay is visible when sidebar is open
            if (sidebar.classList.contains('mobile-open')) {
                overlay.style.display = 'block';
                overlay.style.opacity = '1';
                overlay.style.visibility = 'visible';
            } else {
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 300);
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
            }
        } else {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('left-expanded');
            
            // Show/hide toggle buttons with smooth transition
            if (sidebar.classList.contains('collapsed')) {
                sidebarToggleButton.classList.remove('hidden');
                newChatButton.classList.remove('hidden');
                requestAnimationFrame(() => {
                    sidebarToggleButton.style.opacity = '1';
                    newChatButton.style.opacity = '1';
                });
            } else {
                sidebarToggleButton.style.opacity = '0';
                newChatButton.style.opacity = '0';
                setTimeout(() => {
                    sidebarToggleButton.classList.add('hidden');
                    newChatButton.classList.add('hidden');
                }, 300);
            }
        }
    }

    // Initialize toggle buttons state
    function initializeToggleButtons() {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) {
            if (sidebar.classList.contains('collapsed')) {
                sidebarToggleButton.classList.remove('hidden');
                newChatButton.classList.remove('hidden');
                sidebarToggleButton.style.opacity = '1';
                newChatButton.style.opacity = '1';
            } else {
                sidebarToggleButton.classList.add('hidden');
                newChatButton.classList.add('hidden');
                sidebarToggleButton.style.opacity = '0';
                newChatButton.style.opacity = '0';
            }
        }
    }

    initializeToggleButtons();

    // Add click event listeners
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
    }

    if (sidebarMenuButton) {
        sidebarMenuButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
    }

    if (sidebarToggleButton) {
        sidebarToggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Close sidebar when clicking overlay
    overlay.addEventListener('click', function(e) {
        e.preventDefault();
        if (sidebar.classList.contains('mobile-open')) {
            toggleSidebar();
        }
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        const isMobile = window.innerWidth <= 768;
        if (isMobile && sidebar.classList.contains('mobile-open')) {
            if (!sidebar.contains(e.target) && 
                !mobileMenuButton.contains(e.target) && 
                !overlay.contains(e.target)) {
                toggleSidebar();
            }
        }
    });

    // Handle window resize
    let lastWidth = window.innerWidth;
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const isMobile = window.innerWidth <= 768;
            const wasDesktop = lastWidth > 768;
            const isDesktop = window.innerWidth > 768;

            // Reset classes when switching between mobile and desktop
            if (wasDesktop && !isDesktop) {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('left-expanded');
                sidebarToggleButton.style.opacity = '0';
                newChatButton.style.opacity = '0';
                setTimeout(() => {
                    sidebarToggleButton.classList.add('hidden');
                    newChatButton.classList.add('hidden');
                }, 300);
            } else if (!wasDesktop && isDesktop) {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
                overlay.style.display = 'none';
                document.body.style.overflow = '';
            }

            lastWidth = window.innerWidth;
        }, 150);
    });

    // Handle input focus and typing
    const searchInput = document.querySelector('.search-input-wrapper input');
    const searchWrapper = document.querySelector('.search-input-wrapper');

    if (searchInput && searchWrapper) {
        // Handle focus/blur events
        searchInput.addEventListener('focus', () => {
            searchWrapper.classList.add('focus');
            if (searchInput.value.trim() !== '') {
                searchWrapper.classList.add('typing');
            }
        });

        searchInput.addEventListener('blur', () => {
            searchWrapper.classList.remove('focus');
            if (searchInput.value.trim() === '') {
                searchWrapper.classList.remove('typing');
            }
        });

        // Handle input changes
        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim() !== '') {
                searchWrapper.classList.add('typing');
            } else {
                searchWrapper.classList.remove('typing');
            }
        });
    }

    // Add mouse move handler for history items
    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            item.style.setProperty('--mouse-x', `${x}px`);
            item.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}); 