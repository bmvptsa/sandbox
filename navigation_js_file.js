/**
 * Beachside Montessori Village PTSA - Dynamic Navigation System
 * This file manages the dynamic navigation for all pages
 */

// Navigation Configuration - Update this object to modify site navigation
const navigationConfig = {
    items: [
        { 
            text: 'Home', 
            url: '/index.html', 
            id: 'home'
        },
        {
            text: 'Calendar',
            url: '/pages/calendar.html',
            id: 'calendar',
            dropdown: [
                { text: 'Event Calendar', url: '/pages/calendar.html' },
                { text: 'Meeting Dates', url: '/pages/meetings.html' },
                { text: 'School Calendar', url: '/pages/school-calendar.html' }
            ]
        },
        {
            text: 'About',
            url: '/pages/about.html',
            id: 'about',
            dropdown: [
                { text: 'Executive Board', url: '/pages/board.html' },
                { text: 'Committees', url: '/pages/committees.html' },
                { text: 'PTSA Handbook', url: '/pages/handbook.html' },
                { text: 'What We Fund', url: '/pages/funding.html' }
            ]
        },
        {
            text: 'Get Involved',
            url: '/pages/get-involved.html',
            id: 'get-involved',
            dropdown: [
                { text: 'Volunteer Opportunities', url: '/pages/volunteer.html' },
                { text: 'Room Parents', url: '/pages/room-parents.html' },
                { text: 'Adopt-A-Class', url: '/pages/adopt-class.html' },
                { text: 'Join a Committee', url: '/pages/join-committee.html' }
            ]
        },
        {
            text: 'Programs',
            url: '/pages/programs.html',
            id: 'programs',
            dropdown: [
                { text: 'Adopt-A-Class', url: '/pages/adopt-class.html' },
                { text: 'Fundraising', url: '/pages/fundraising.html' },
                { text: 'Sponsorship', url: '/pages/sponsorship.html' },
                { text: 'Business Directory', url: '/pages/business-directory.html' }
            ]
        },
        {
            text: 'Store',
            url: '/pages/store.html',
            id: 'store'
        },
        {
            text: 'Resources',
            url: '/pages/resources.html',
            id: 'resources',
            dropdown: [
                { text: 'Budget & Finances', url: '/pages/budget.html' },
                { text: 'Forms & Documents', url: '/pages/forms.html' },
                { text: 'Meeting Minutes', url: '/pages/minutes.html' },
                { text: 'Recommended Partners', url: '/pages/partners.html' }
            ]
        }
    ]
};

/**
 * Generate navigation HTML from configuration
 * @param {Object} config - Navigation configuration object
 */
function generateNavigation(config) {
    const navContainer = document.getElementById('dynamicNavigation');
    
    if (!navContainer) {
        console.warn('Navigation container not found');
        return;
    }
    
    let navHTML = `
        <div class="nav-container">
            <button class="mobile-toggle" onclick="toggleMobileMenu()" aria-label="Toggle mobile menu">
                ☰
            </button>
            <ul class="nav-menu" id="navMenu" role="menubar">
    `;

    config.items.forEach((item, index) => {
        const hasDropdown = item.dropdown && item.dropdown.length > 0;
        const dropdownId = hasDropdown ? `dropdown-${item.id}` : '';
        
        navHTML += `
            <li class="nav-item" role="none">
                <a href="${item.url}" 
                   class="nav-link" 
                   role="menuitem"
                   ${hasDropdown ? `aria-haspopup="true" aria-expanded="false" aria-controls="${dropdownId}"` : ''}
                   data-page="${item.id}">
                    ${item.text}
                    ${hasDropdown ? '<span class="dropdown-indicator" aria-hidden="true">▼</span>' : ''}
                </a>
        `;

        if (hasDropdown) {
            navHTML += `
                <div class="dropdown" id="${dropdownId}" role="menu" aria-label="${item.text} submenu">
            `;
            
            item.dropdown.forEach(subItem => {
                navHTML += `
                    <a href="${subItem.url}" 
                       class="dropdown-item" 
                       role="menuitem">
                        ${subItem.text}
                    </a>
                `;
            });
            
            navHTML += '</div>';
        }

        navHTML += '</li>';
    });

    navHTML += `
            </ul>
        </div>
    `;

    navContainer.innerHTML = navHTML;
}

/**
 * Toggle mobile menu visibility
 */
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const mobileToggle = document.querySelector('.mobile-toggle');
    
    if (navMenu) {
        const isOpen = navMenu.classList.contains('mobile-open');
        navMenu.classList.toggle('mobile-open');
        
        // Update ARIA attributes
        if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', !isOpen);
        }
        
        // Update dropdown ARIA states
        const dropdownLinks = navMenu.querySelectorAll('[aria-haspopup="true"]');
        dropdownLinks.forEach(link => {
            link.setAttribute('aria-expanded', 'false');
        });
    }
}

/**
 * Set active page in navigation
 * @param {string} pageUrl - Current page URL
 */
function setActivePage(pageUrl) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-current', 'false');
    });
    
    // Find and activate current page link
    const currentLink = document.querySelector(`.nav-link[href="${pageUrl}"]`);
    if (currentLink) {
        currentLink.classList.add('active');
        currentLink.setAttribute('aria-current', 'page');
    } else {
        // Try to match by data-page attribute for more flexible matching
        const pathSegments = pageUrl.split('/');
        const pageName = pathSegments[pathSegments.length - 1].replace('.html', '');
        const matchingLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
        
        if (matchingLink) {
            matchingLink.classList.add('active');
            matchingLink.setAttribute('aria-current', 'page');
        }
    }
}

/**
 * Handle keyboard navigation for dropdowns
 */
function handleKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        const activeElement = document.activeElement;
        
        // Handle Escape key to close mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('navMenu');
            if (navMenu && navMenu.classList.contains('mobile-open')) {
                toggleMobileMenu();
            }
        }
        
        // Handle Enter/Space on dropdown toggles
        if ((e.key === 'Enter' || e.key === ' ') && 
            activeElement.classList.contains('nav-link') && 
            activeElement.hasAttribute('aria-haspopup')) {
            
            e.preventDefault();
            const dropdown = activeElement.nextElementSibling;
            if (dropdown) {
                const isExpanded = activeElement.getAttribute('aria-expanded') === 'true';
                activeElement.setAttribute('aria-expanded', !isExpanded);
                
                if (window.innerWidth <= 768) {
                    const parentItem = activeElement.closest('.nav-item');
                    parentItem.classList.toggle('dropdown-open');
                }
            }
        }
    });
}

/**
 * Handle mobile dropdown interactions
 */
function handleMobileDropdowns() {
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            const clickedLink = event.target.closest('.nav-link');
            
            if (clickedLink && clickedLink.hasAttribute('aria-haspopup')) {
                event.preventDefault();
                
                const parentItem = clickedLink.closest('.nav-item');
                const isOpen = parentItem.classList.contains('dropdown-open');
                
                // Close all other dropdowns
                const allDropdownItems = document.querySelectorAll('.nav-item');
                allDropdownItems.forEach(item => {
                    if (item !== parentItem) {
                        item.classList.remove('dropdown-open');
                    }
                });
                
                // Toggle current dropdown
                parentItem.classList.toggle('dropdown-open');
                clickedLink.setAttribute('aria-expanded', !isOpen);
            }
        }
    });
}

/**
 * Close mobile menu when clicking outside
 */
function handleOutsideClick() {
    document.addEventListener('click', function(event) {
        const navMenu = document.getElementById('navMenu');
        const mobileToggle = document.querySelector('.mobile-toggle');
        const navigation = document.querySelector('.navigation');
        
        if (navMenu && mobileToggle && navigation && 
            !navigation.contains(event.target) && 
            navMenu.classList.contains('mobile-open')) {
            toggleMobileMenu();
        }
    });
}

/**
 * Dynamically add a menu item
 * @param {Object} newItem - New menu item object
 * @param {number|null} position - Position to insert (null for end)
 */
function addMenuItem(newItem, position = null) {
    if (position === null) {
        navigationConfig.items.push(newItem);
    } else {
        navigationConfig.items.splice(position, 0, newItem);
    }
    generateNavigation(navigationConfig);
    initializeEventListeners();
}

/**
 * Remove a menu item by ID
 * @param {string} itemId - ID of item to remove
 */
function removeMenuItem(itemId) {
    navigationConfig.items = navigationConfig.items.filter(item => item.id !== itemId);
    generateNavigation(navigationConfig);
    initializeEventListeners();
}

/**
 * Update a menu item
 * @param {string} itemId - ID of item to update
 * @param {Object} updates - Object with properties to update
 */
function updateMenuItem(itemId, updates) {
    const itemIndex = navigationConfig.items.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        navigationConfig.items[itemIndex] = { ...navigationConfig.items[itemIndex], ...updates };
        generateNavigation(navigationConfig);
        initializeEventListeners();
    }
}

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
    handleKeyboardNavigation();
    handleMobileDropdowns();
    handleOutsideClick();
}

/**
 * Initialize navigation system
 */
function initializeNavigation() {
    // Generate navigation HTML
    generateNavigation(navigationConfig);
    
    // Set up event listeners
    initializeEventListeners();
    
    // Set active page based on current URL
    const currentPath = window.location.pathname;
    setActivePage(currentPath);
    
    console.log('BMV PTSA Navigation initialized');
}

/**
 * Get current navigation configuration
 * @returns {Object} Current navigation configuration
 */
function getNavigationConfig() {
    return { ...navigationConfig };
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeNavigation);

// Export navigation functions for global access
window.BMVNavigation = {
    generate: generateNavigation,
    setActive: setActivePage,
    addItem: addMenuItem,
    removeItem: removeMenuItem,
    updateItem: updateMenuItem,
    getConfig: getNavigationConfig,
    toggle: toggleMobileMenu
};

// For debugging in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.navigationConfig = navigationConfig;
    console.log('Navigation config available as window.navigationConfig for debugging');
}