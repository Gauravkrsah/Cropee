document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const mobileMenuButton = document.querySelector('.mobile-header .menu-button');
    const sidebarMenuButton = document.querySelector('.sidebar .menu-button');
    const sidebarToggleButton = document.getElementById('sidebarToggleButton');
    const newChatButton = document.getElementById('newChatButton');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const rightSidebar = document.querySelector('.right-sidebar');
    const productsPanel = document.querySelector('.products-panel');
    const expertsPanel = document.querySelector('.experts-panel');
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    let activePanel = null;

    // Function to close all panels
    function closeAllPanels() {
        sidebar.classList.remove('mobile-open');
        rightSidebar.classList.remove('active');
        productsPanel.classList.remove('active');
        expertsPanel.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        activePanel = null;
    }

    // Function to initialize mobile state
    function initializeMobileState() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            sidebar.classList.remove('mobile-open', 'collapsed');
            mainContent.classList.remove('left-expanded');
            closeAllPanels();
            document.body.style.overflow = '';
        }
    }

    // Initialize mobile state on page load
    initializeMobileState();

    // Function to toggle sidebar
    function toggleSidebar() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Close right sidebar if open
            if (rightSidebar.classList.contains('active')) {
                rightSidebar.classList.remove('active');
                productsPanel.classList.remove('active');
                expertsPanel.classList.remove('active');
                activePanel = null;
            }

            // Toggle left sidebar
            if (sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                sidebar.classList.add('mobile-open');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        } else {
            // Desktop mode
            if (sidebar.classList.contains('collapsed')) {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('left-expanded');
                sidebarToggleButton.style.opacity = '0';
                newChatButton.style.opacity = '0';
                setTimeout(() => {
                    sidebarToggleButton.classList.add('hidden');
                    newChatButton.classList.add('hidden');
                }, 300);
            } else {
                sidebar.classList.add('collapsed');
                mainContent.classList.add('left-expanded');
                sidebarToggleButton.classList.remove('hidden');
                newChatButton.classList.remove('hidden');
                requestAnimationFrame(() => {
                    sidebarToggleButton.style.opacity = '1';
                    newChatButton.style.opacity = '1';
                });
            }
        }
    }

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
                // Switching to mobile
                sidebar.classList.remove('collapsed', 'mobile-open');
                mainContent.classList.remove('left-expanded');
                closeAllPanels();
            } else if (!wasDesktop && isDesktop) {
                // Switching to desktop
                closeAllPanels();
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }

            lastWidth = window.innerWidth;
        }, 150);
    });

    // Function to toggle right sidebar
    function toggleRightSidebar(panel) {
        const isMobile = window.innerWidth <= 768;
        
        // If the same panel is clicked while sidebar is open, close it
        if (rightSidebar.classList.contains('active') && activePanel === panel) {
            rightSidebar.classList.remove('active');
            productsPanel.classList.remove('active');
            expertsPanel.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            activePanel = null;
            return;
        }

        // On mobile, close left sidebar if it's open
        if (isMobile && sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
        }

        // Reset panels and show the selected one
        rightSidebar.classList.add('active');
        productsPanel.classList.remove('active');
        expertsPanel.classList.remove('active');

        // Clear any existing transform styles
        rightSidebar.style.transform = '';
        productsPanel.style.transform = '';
        expertsPanel.style.transform = '';

        if (panel === 'products') {
            productsPanel.classList.add('active');
        } else if (panel === 'experts') {
            expertsPanel.classList.add('active');
        }

        activePanel = panel;

        // On mobile, add overlay and prevent body scroll
        if (isMobile) {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Add click event listeners for mobile menu buttons
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
    }

    if (sidebarMenuButton) {
        sidebarMenuButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Add click event listener for sidebar toggle button
    if (sidebarToggleButton) {
        sidebarToggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Add click event listeners for header icons
    const headerIcons = document.querySelectorAll('.header-icon');
    headerIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const isShoppingBag = icon.querySelector('.material-symbols-outlined');
            const panel = isShoppingBag ? 'products' : 'experts';
            toggleRightSidebar(panel);
        });
    });

    // Close panels when clicking overlay
    overlay.addEventListener('click', () => {
        closeAllPanels();
    });

    // Close panels when clicking outside
    document.addEventListener('click', function(e) {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            const isClickInsideSidebar = sidebar.contains(e.target);
            const isClickInsideRightSidebar = rightSidebar.contains(e.target);
            const isClickOnMenuButton = mobileMenuButton && mobileMenuButton.contains(e.target);
            const isClickOnSidebarButton = sidebarMenuButton && sidebarMenuButton.contains(e.target);
            const isClickOnHeaderIcons = Array.from(headerIcons).some(icon => icon.contains(e.target));
            const isClickOnOverlay = overlay.contains(e.target);

            if (!isClickInsideSidebar && !isClickInsideRightSidebar && 
                !isClickOnMenuButton && !isClickOnSidebarButton && 
                !isClickOnHeaderIcons && !isClickOnOverlay) {
                closeAllPanels();
            }
        }
    });

    // Add close button functionality
    document.querySelectorAll('.panel-close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const panels = document.querySelectorAll('.right-panel');
            
            // Reset transform styles when closing
            rightSidebar.style.transform = '';
            panels.forEach(panel => {
                panel.style.transform = '';
                panel.style.opacity = '';
            });
            
            closeAllPanels();
        });
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

    // Handle favorite button clicks
    document.querySelectorAll('.action-btn.favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const icon = btn.querySelector('.material-icons');
            if (icon.textContent === 'favorite_border') {
                icon.textContent = 'favorite';
                btn.classList.add('active');
            } else {
                icon.textContent = 'favorite_border';
                btn.classList.remove('active');
            }
        });
    });

    // Handle expert filters
    document.querySelectorAll('.expert-filters .filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.expert-filters .filter-btn').forEach(b => {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            // Add filter logic here
        });
    });

    // Enhanced hover effect for desktop sidebars
    let rightHoverTimeout;

    // Left sidebar hover - only expand on hover, don't collapse
    sidebar.addEventListener('mouseenter', () => {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile && sidebar.classList.contains('collapsed')) {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('left-expanded');
            
            // Hide toggle buttons
            sidebarToggleButton.style.opacity = '0';
            newChatButton.style.opacity = '0';
            setTimeout(() => {
                sidebarToggleButton.classList.add('hidden');
                newChatButton.classList.add('hidden');
            }, 300);
        }
    });

    // Right sidebar hover
    rightSidebar.addEventListener('mouseenter', () => {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) {
            clearTimeout(headerIconHoverTimeout);
            clearTimeout(rightHoverTimeout);
            rightSidebar.classList.add('active');
        }
    });

    rightSidebar.addEventListener('mouseleave', (e) => {
        const isMobile = window.innerWidth <= 768;
        if (!isMobile) {
            // Check if the mouse is moving towards the header icons
            const headerIconsArray = Array.from(headerIcons);
            const isMovingToHeaderIcons = headerIconsArray.some(icon => {
                const rect = icon.getBoundingClientRect();
                return e.clientX >= rect.left && e.clientX <= rect.right && 
                       e.clientY >= rect.top && e.clientY <= rect.bottom;
            });

            if (!isMovingToHeaderIcons) {
                rightHoverTimeout = setTimeout(() => {
                    rightSidebar.classList.remove('active');
                    productsPanel.classList.remove('active');
                    expertsPanel.classList.remove('active');
                    activePanel = null;
                }, 200); // Faster closing for better UX
            }
        }
    });

    // Add hover functionality for header icons in desktop mode
    let headerIconHoverTimeout;

    headerIcons.forEach(icon => {
        icon.addEventListener('mouseenter', (e) => {
            const isMobile = window.innerWidth <= 768;
            if (!isMobile) {
                clearTimeout(headerIconHoverTimeout);
                const isShoppingBag = icon.querySelector('.material-symbols-outlined');
                const panel = isShoppingBag ? 'products' : 'experts';
                
                // Only open if not already open or if different panel
                if (!rightSidebar.classList.contains('active') || activePanel !== panel) {
                    toggleRightSidebar(panel);
                }
            }
        });

        icon.addEventListener('mouseleave', (e) => {
            const isMobile = window.innerWidth <= 768;
            if (!isMobile) {
                // Check if the mouse is moving towards the right sidebar
                const rect = rightSidebar.getBoundingClientRect();
                if (e.clientX < rect.left || e.clientY < rect.top || e.clientY > rect.bottom) {
                    headerIconHoverTimeout = setTimeout(() => {
                        // Only close if mouse isn't over the right sidebar
                        if (!rightSidebar.matches(':hover')) {
                            rightSidebar.classList.remove('active');
                            productsPanel.classList.remove('active');
                            expertsPanel.classList.remove('active');
                            activePanel = null;
                        }
                    }, 100);
                }
            }
        });
    });

    // Initialize product sorting
    document.querySelector('.sort-btn').addEventListener('click', () => {
        const productsGrid = document.querySelector('.products-grid');
        const products = Array.from(productsGrid.children);
        
        products.forEach(product => {
            product.style.opacity = '0';
            product.style.transform = 'translateY(10px)';
        });

        setTimeout(() => {
            products.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.current-price').textContent.replace('₹', ''));
                const priceB = parseFloat(b.querySelector('.current-price').textContent.replace('₹', ''));
                return priceA - priceB;
            });

            productsGrid.innerHTML = '';
            
            products.forEach((product, index) => {
                setTimeout(() => {
                    productsGrid.appendChild(product);
                    setTimeout(() => {
                        product.style.opacity = '1';
                        product.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
            });
        }, 300);
    });

    // Filter functionality
    const categoryFilters = document.querySelectorAll('.category-filter');
    const productCards = document.querySelectorAll('.product-card');
    
    categoryFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Remove active class from all filters
            categoryFilters.forEach(f => f.classList.remove('active'));
            // Add active class to clicked filter
            filter.classList.add('active');
            
            const category = filter.textContent.trim().toLowerCase();
            
            // Filter products
            productCards.forEach(card => {
                const productType = card.querySelector('.product-type').textContent.toLowerCase();
                card.style.opacity = '0';
                card.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    if (category === 'all' || productType.includes(category)) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // Enhanced hover effects for product cards
    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}); 