// Responsive JavaScript for E-commerce Website
class ResponsiveEcommerce {
    constructor() {
        this.init();
        this.bindEvents();
        this.handleResize();
    }

    init() {
        this.sidebar = document.querySelector('.the-sidebar');
        this.navbar = document.querySelector('.navbar');
        this.contentArea = document.querySelector('.content-area');
        this.searchInput = document.querySelector('.input');
        this.navLinks = document.querySelector('.nav-links');
        this.sidebarMenu = document.querySelector('.sidebar-menu');
        
        // Create mobile elements
        this.createMobileElements();
        
        // Set initial state
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        this.sidebarOpen = false;
        
        // Touch support detection
        this.hasTouch = 'ontouchstart' in window;
    }

    createMobileElements() {
        // Create hamburger menu button
        this.hamburger = document.createElement('button');
        this.hamburger.className = 'hamburger-menu';
        this.hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        // Create mobile search toggle
        this.searchToggle = document.createElement('button');
        this.searchToggle.className = 'search-toggle';
        this.searchToggle.innerHTML = '🔍';
        
        // Create overlay for mobile sidebar
        this.overlay = document.createElement('div');
        this.overlay.className = 'sidebar-overlay';
        
        // Create mobile nav menu
        this.mobileNavMenu = document.createElement('div');
        this.mobileNavMenu.className = 'mobile-nav-menu';
        
        // Insert elements into DOM
        this.navbar.insertBefore(this.hamburger, this.navbar.firstChild);
        this.navbar.appendChild(this.searchToggle);
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.mobileNavMenu);
    }

    bindEvents() {
        // Window resize event
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Orientation change event
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleResize(), 100);
        });

        // Hamburger menu click
        this.hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleSidebar();
        });

        // Search toggle click
        this.searchToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleSearch();
        });

        // Overlay click to close sidebar
        this.overlay.addEventListener('click', () => {
            this.closeSidebar();
        });

        // Sidebar menu interactions
        this.sidebarMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                this.handleSidebarClick(e);
            }
        });

        // Touch events for swipe gestures
        if (this.hasTouch) {
            this.bindTouchEvents();
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // Search functionality
        this.searchInput.addEventListener('input', this.debounce((e) => {
            this.handleSearch(e.target.value);
        }, 300));

        // Scroll events for navbar behavior
        let lastScrollTop = 0;
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll(lastScrollTop);
            lastScrollTop = window.pageYOffset;
        }, 100));
    }

    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // Update device type flags
        this.isMobile = width <= 768;
        this.isTablet = width > 768 && width <= 1024;
        this.isDesktop = width > 1024;
        
        console.log(`Resize: ${width}x${height}, Mobile: ${this.isMobile}, Tablet: ${this.isTablet}`);
        
        // Apply responsive classes
        document.body.className = '';
        if (this.isMobile) {
            document.body.classList.add('mobile');
            this.setupMobile();
        } else if (this.isTablet) {
            document.body.classList.add('tablet');
            this.setupTablet();
        } else {
            document.body.classList.add('desktop');
            this.setupDesktop();
        }

        // Adjust sidebar
        this.adjustSidebar();
        
        // Adjust search
        this.adjustSearch();
        
        // Adjust content spacing
        this.adjustContent();
    }

    setupMobile() {
        this.hamburger.style.display = 'flex';
        this.searchToggle.style.display = 'block';
        
        // Move nav links to mobile menu
        const navLinksClone = this.navLinks.cloneNode(true);
        navLinksClone.className = 'mobile-nav-links';
        this.mobileNavMenu.innerHTML = '';
        this.mobileNavMenu.appendChild(navLinksClone);
        
        // Hide original nav links
        this.navLinks.style.display = 'none';
        
        // Close sidebar if open
        if (this.sidebarOpen) {
            this.closeSidebar();
        }
    }

    setupTablet() {
        this.hamburger.style.display = 'flex';
        this.searchToggle.style.display = 'none';
        this.navLinks.style.display = 'flex';
        
        // Adjust search width
        this.searchInput.style.width = '250px';
    }

    setupDesktop() {
        this.hamburger.style.display = 'none';
        this.searchToggle.style.display = 'none';
        this.navLinks.style.display = 'flex';
        
        // Reset search width
        this.searchInput.style.width = '300px';
        
        // Ensure sidebar is visible
        this.sidebar.classList.remove('mobile-hidden');
        this.overlay.classList.remove('active');
        this.sidebarOpen = false;
    }

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        
        if (this.sidebarOpen) {
            this.openSidebar();
        } else {
            this.closeSidebar();
        }
    }

    openSidebar() {
        this.sidebar.classList.add('mobile-open');
        this.overlay.classList.add('active');
        this.hamburger.classList.add('active');
        document.body.classList.add('sidebar-open');
        this.sidebarOpen = true;
        
        // Focus first sidebar link for accessibility
        const firstLink = this.sidebar.querySelector('a');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 300);
        }
    }

    closeSidebar() {
        this.sidebar.classList.remove('mobile-open');
        this.overlay.classList.remove('active');
        this.hamburger.classList.remove('active');
        document.body.classList.remove('sidebar-open');
        this.sidebarOpen = false;
    }

    toggleSearch() {
        const searchContainer = this.searchInput.parentElement;
        searchContainer.classList.toggle('mobile-search-active');
        
        if (searchContainer.classList.contains('mobile-search-active')) {
            this.searchInput.focus();
        }
    }

    adjustSidebar() {
        if (this.isMobile || this.isTablet) {
            const navbarHeight = this.navbar.offsetHeight;
            this.sidebar.style.top = `${navbarHeight}px`;
            this.sidebar.style.height = `calc(100vh - ${navbarHeight}px)`;
        }
    }

    adjustSearch() {
        if (this.isMobile) {
            this.searchInput.style.width = '200px';
        } else if (this.isTablet) {
            this.searchInput.style.width = '250px';
        } else {
            this.searchInput.style.width = '300px';
        }
    }

    adjustContent() {
        const navbarHeight = this.navbar.offsetHeight;
        const sidebarWidth = this.isMobile ? 0 : (this.isTablet ? 200 : 220);
        
        if (this.contentArea) {
            this.contentArea.style.marginTop = `${navbarHeight}px`;
            this.contentArea.style.marginLeft = this.isMobile ? '0' : `${sidebarWidth}px`;
            this.contentArea.style.width = this.isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`;
        }
    }

    bindTouchEvents() {
        let startX, startY, currentX, currentY;
        let isSwipeGesture = false;
        
        // Touch start
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isSwipeGesture = true;
            }
        });
        
        // Touch move
        document.addEventListener('touchmove', (e) => {
            if (!isSwipeGesture || e.touches.length !== 1) return;
            
            currentX = e.touches[0].clientX;
            currentY = e.touches[0].clientY;
        });
        
        // Touch end - handle swipe gestures
        document.addEventListener('touchend', (e) => {
            if (!isSwipeGesture) return;
            
            const deltaX = currentX - startX;
            const deltaY = currentY - startY;
            const minSwipeDistance = 50;
            
            // Horizontal swipe detection
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0 && startX < 50 && !this.sidebarOpen && this.isMobile) {
                    // Swipe right from left edge - open sidebar
                    this.openSidebar();
                } else if (deltaX < 0 && this.sidebarOpen) {
                    // Swipe left - close sidebar
                    this.closeSidebar();
                }
            }
            
            isSwipeGesture = false;
        });
    }

    handleKeyboard(e) {
        // Escape key closes sidebar
        if (e.key === 'Escape' && this.sidebarOpen) {
            this.closeSidebar();
        }
        
        // Alt + M toggles sidebar
        if (e.altKey && e.key === 'm') {
            e.preventDefault();
            this.toggleSidebar();
        }
    }

    handleSidebarClick(e) {
        e.preventDefault();
        
        // Remove active class from all links
        this.sidebarMenu.querySelectorAll('a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        e.target.classList.add('active');
        
        // Close sidebar on mobile after selection
        if (this.isMobile) {
            setTimeout(() => this.closeSidebar(), 300);
        }
        
        console.log('Selected category:', e.target.textContent);
    }

    handleSearch(query) {
        console.log('Search query:', query);
        // Implement search functionality here
        
        // Show search suggestions for mobile
        if (this.isMobile && query.length > 2) {
            this.showSearchSuggestions(query);
        }
    }

    showSearchSuggestions(query) {
        // Create or update search suggestions
        let suggestions = document.querySelector('.search-suggestions');
        if (!suggestions) {
            suggestions = document.createElement('div');
            suggestions.className = 'search-suggestions';
            this.searchInput.parentElement.appendChild(suggestions);
        }
        
        // Mock suggestions - replace with real data
        const mockSuggestions = [
            'Groceries', 'Cosmetics', 'Snacks', 'Beauty Care', 'Special Deals'
        ].filter(item => item.toLowerCase().includes(query.toLowerCase()));
        
        suggestions.innerHTML = mockSuggestions
            .map(item => `<div class="suggestion-item">${item}</div>`)
            .join('');
        
        suggestions.style.display = mockSuggestions.length ? 'block' : 'none';
    }

    handleScroll(lastScrollTop) {
        const currentScroll = window.pageYOffset;
        
        // Hide/show navbar on scroll (mobile only)
        if (this.isMobile) {
            if (currentScroll > lastScrollTop && currentScroll > 100) {
                // Scrolling down
                this.navbar.classList.add('navbar-hidden');
            } else {
                // Scrolling up
                this.navbar.classList.remove('navbar-hidden');
            }
        }
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, wait) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, wait);
            }
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.responsiveEcommerce = new ResponsiveEcommerce();
    console.log('Responsive E-commerce initialized');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Recheck layout when page becomes visible
        window.responsiveEcommerce?.handleResize();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveEcommerce;
}


// Add this to your existing js.js file or create a separate file

// Category scroll functionality
class CategoryScroll {
    constructor() {
        this.init();
        this.bindEvents();
    }

    init() {
        this.categoryContainer = document.querySelector('.mainTile');
        this.scrollLeftBtn = document.querySelector('.scrollLeft');
        this.scrollRightBtn = document.querySelector('.scrollRight');
        this.scrollAmount = 200; // pixels to scroll
        
        // Check if elements exist
        if (!this.categoryContainer || !this.scrollLeftBtn || !this.scrollRightBtn) {
            console.warn('Category scroll elements not found');
            return;
        }
        
        this.updateScrollButtons();
    }

    bindEvents() {
        if (!this.categoryContainer) return;

        // Scroll button events
        this.scrollLeftBtn?.addEventListener('click', () => {
            this.scrollLeft();
        });

        this.scrollRightBtn?.addEventListener('click', () => {
            this.scrollRight();
        });

        // Update buttons on scroll
        this.categoryContainer.addEventListener('scroll', () => {
            this.updateScrollButtons();
        });

        // Update on resize
        window.addEventListener('resize', () => {
            setTimeout(() => this.updateScrollButtons(), 100);
        });

        // Touch/mouse wheel horizontal scroll
        this.categoryContainer.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                return; // Already scrolling horizontally
            }
            
            e.preventDefault();
            this.categoryContainer.scrollLeft += e.deltaY;
        });
    }

    scrollLeft() {
        this.categoryContainer.scrollBy({
            left: -this.scrollAmount,
            behavior: 'smooth'
        });
    }

    scrollRight() {
        this.categoryContainer.scrollBy({
            left: this.scrollAmount,
            behavior: 'smooth'
        });
    }

    updateScrollButtons() {
        const container = this.categoryContainer;
        const isAtStart = container.scrollLeft <= 0;
        const isAtEnd = container.scrollLeft >= (container.scrollWidth - container.clientWidth - 1);

        // Update button states
        if (this.scrollLeftBtn) {
            this.scrollLeftBtn.style.opacity = isAtStart ? '0.4' : '1';
            this.scrollLeftBtn.style.cursor = isAtStart ? 'not-allowed' : 'pointer';
            this.scrollLeftBtn.disabled = isAtStart;
        }

        if (this.scrollRightBtn) {
            this.scrollRightBtn.style.opacity = isAtEnd ? '0.4' : '1';
            this.scrollRightBtn.style.cursor = isAtEnd ? 'not-allowed' : 'pointer';
            this.scrollRightBtn.disabled = isAtEnd;
        }
    }
}

// Initialize category scroll when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        window.categoryScroll = new CategoryScroll();
        console.log('Category scroll initialized');
    }, 100);
});

// Add to your existing ResponsiveEcommerce class
if (typeof window.responsiveEcommerce !== 'undefined') {
    // Extend the existing ResponsiveEcommerce class
    const originalHandleResize = window.responsiveEcommerce.handleResize;
    window.responsiveEcommerce.handleResize = function() {
        originalHandleResize.call(this);
        // Update category scroll after resize
        if (window.categoryScroll) {
            window.categoryScroll.updateScrollButtons();
        }
    };
}
const res = await fetch("http://localhost:5000/api/users/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, password })
});
