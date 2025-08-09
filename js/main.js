/**
 * Beachside Montessori Village PTSA - Main JavaScript
 * General functionality and interactions for the website.
 */

// Configuration
const SITE_CONFIG = {
    // External service URLs - Update these with your actual links
    givebacksCalendar: 'https://your-givebacks-calendar.com',
    signUpGenius: 'https://your-signupgenius.com',
    membershipPortal: 'https://your-membership-link.com',
    
    // Canva integration settings
    canvaTeamId: 'your-canva-team-id',
    canvaApiKey: 'your-canva-api-key', // Store securely
    
    // Animation settings
    animationDuration: 300,
    carouselSpeed: 20000, // 20 seconds
    
    // Contact information
    contact: {
        email: 'info@bmvptsa.org',
        phone: '(954) 555-0123',
        address: '2230 Lincoln St, Hollywood, FL 33020'
    }
};

/**
 * Utility Functions
 */

// Debounce function for performance optimization
function debounce(func, wait) {
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

// Smooth scroll to element
function scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Format date for display
function formatEventDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Sponsor Management
 */

class SponsorManager {
    constructor() {
        this.sponsors = {
            platinum: [],
            gold: [],
            silver: []
        };
        this.loadSponsors();
    }
    
    async loadSponsors() {
        try {
            // In a real implementation, this would fetch from your CMS or API
            const response = await fetch('/api/sponsors.json');
            if (response.ok) {
                this.sponsors = await response.json();
                this.renderSponsors();
            } else {
                // Fallback to static data
                this.loadStaticSponsors();
            }
        } catch (error) {
            console.log('Loading static sponsor data');
            this.loadStaticSponsors();
        }
    }
    
    loadStaticSponsors() {
        // Static sponsor data as fallback
        this.sponsors = {
            platinum: [
                { name: 'Premium Partner A', logo: '/assets/sponsors/platinum/sponsor-a.png', url: 'https://example.com' },
                { name: 'Premium Partner B', logo: '/assets/sponsors/platinum/sponsor-b.png', url: 'https://example.com' },
                { name: 'Premium Partner C', logo: '/assets/sponsors/platinum/sponsor-c.png', url: 'https://example.com' },
                { name: 'Premium Partner D', logo: '/assets/sponsors/platinum/sponsor-d.png', url: 'https://example.com' },
                { name: 'Premium Partner E', logo: '/assets/sponsors/platinum/sponsor-e.png', url: 'https://example.com' },
                { name: 'Premium Partner F', logo: '/assets/sponsors/platinum/sponsor-f.png', url: 'https://example.com' }
            ],
            gold: [
                { name: 'Gold Sponsor 1', logo: '/assets/sponsors/gold/gold-1.png', url: 'https://example.com' },
                { name: 'Gold Sponsor 2', logo: '/assets/sponsors/gold/gold-2.png', url: 'https://example.com' },
                { name: 'Gold Sponsor 3', logo: '/assets/sponsors/gold/gold-3.png', url: 'https://example.com' },
                { name: 'Gold Sponsor 4', logo: '/assets/sponsors/gold/gold-4.png', url: 'https://example.com' }
            ],
            silver: [
                { name: 'Silver Sponsor 1', logo: '/assets/sponsors/silver/silver-1.png', url: 'https://example.com' },
                { name: 'Silver Sponsor 2', logo: '/assets/sponsors/silver/silver-2.png', url: 'https://example.com' },
                { name: 'Silver Sponsor 3', logo: '/assets/sponsors/silver/silver-3.png', url: 'https://example.com' },
                { name: 'Silver Sponsor 4', logo: '/assets/sponsors/silver/silver-4.png', url: 'https://example.com' }
            ]
        };
        this.renderSponsors();
    }
    
    renderSponsors() {
        this.renderPlatinumCarousel();
        this.renderSponsorTier('gold');
        this.renderSponsorTier('silver');
    }
    
    renderPlatinumCarousel() {
        const track = document.querySelector('.platinum-track');
        if (!track || !this.sponsors.platinum.length) return;
        
        let html = '';
        // Render sponsors twice for seamless loop
        const sponsorsToRender = [...this.sponsors.platinum, ...this.sponsors.platinum];
        
        sponsorsToRender.forEach(sponsor => {
            html += `
                <div class="platinum-sponsor" onclick="openSponsorLink('${sponsor.url}')" data-sponsor="${sponsor.name}">
                    <img src="${sponsor.logo}" alt="${sponsor.name}" loading="lazy">
                    <span class="sponsor-name">${sponsor.name}</span>
                </div>
            `;
        });
        
        track.innerHTML = html;
    }
    
    renderSponsorTier(tier) {
        const grid = document.querySelector(`.${tier}-grid`);
        if (!grid || !this.sponsors[tier].length) return;
        
        let html = '';
        this.sponsors[tier].forEach(sponsor => {
            html += `
                <div class="${tier}-sponsor" onclick="openSponsorLink('${sponsor.url}')" data-sponsor="${sponsor.name}">
                    <img src="${sponsor.logo}" alt="${sponsor.name}" loading="lazy">
                </div>
            `;
        });
        
        grid.innerHTML = html;
    }
}

/**
 * Event Management
 */

class EventManager {
    constructor() {
        this.events = [];
        this.loadEvents();
    }
    
    async loadEvents() {
        try {
            // In production, this would integrate with Givebacks API
            const response = await fetch('/api/events.json');
            if (response.ok) {
                this.events = await response.json();
            } else {
                this.loadStaticEvents();
            }
            this.renderEvents();
        } catch (error) {
            console.log('Loading static event data');
            this.loadStaticEvents();
        }
    }
    
    loadStaticEvents() {
        // Static event data as fallback
        this.events = [
            {
                id: 1,
                title: 'BMV Family Playdate',
                date: '2025-08-10',
                time: '10:00 AM - 12:00 PM',
                location: 'TY Park Playground',
                description: 'POSTPONED UNTIL SUNDAY, AUGUST 10
🎉 BMV Family Playdate – You’re Invited! 🎉

Whether you’re new to Beachside or a returning family, come mix, mingle, and make new friends at our annual BMV Family Playdate!

It’s the perfect chance for:
🌟 New families to meet current ones and ask questions
👧🧒 New students to meet future classmates
😊 Everyone to ease those first-day jitters

We’ll see you at the playground!

Please note: TY Park charges a $3 per vehicle entrance fee on weekends.',
                givebacksUrl: 'https://bmv.givebacks.com/events/9bd8e87d-e1d0-4a4c-ae19-2fae098b48c1/view',
                canvaFlyerId: 'canva-flyer-123'
            },
            {
                id: 2,
                title: 'PTSA General Meeting',
                date: '2025-03-22',
                time: '7:00 PM - 8:30 PM',
                location: 'Media Center',
                description: 'Monthly meeting to discuss upcoming events, budget updates, and new initiatives. All parents welcome!',
                givebacksUrl: 'https://givebacks.com/event2'
            },
            {
                id: 3,
                title: 'Book Fair Week',
                date: '2025-04-05',
                time: '8:00 AM - 4:00 PM',
                location: 'Library',
                description: 'Scholastic Book Fair returns! Browse books for all ages and support our literacy programs.',
                givebacksUrl: 'https://givebacks.com/event3'
            }
        ];
        this.renderEvents();
    }
    
    renderEvents() {
        const container = document.getElementById('eventCards');
        if (!container) return;
        
        let html = '';
        this.events.slice(0, 3).forEach(event => { // Show only first 3 on homepage
            const eventDate = new Date(event.date);
            const monthDay = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
            
            html += `
                <div class="event-card" onclick="openEventLink('${event.givebacksUrl}')">
                    <div class="event-date">${monthDay}</div>
                    <div class="event-title">${event.title}</div>
                    <div class="event-description">${event.description}</div>
                    <div class="event-meta">
                        <span class="event-time">🕐 ${event.time}</span>
                        <span class="event-location">📍 ${event.location}</span>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
}

/**
 * Canva Integration
 */

class CanvaIntegration {
    constructor() {
        this.apiKey = SITE_CONFIG.canvaApiKey;
        this.teamId = SITE_CONFIG.canvaTeamId;
        this.webhookEndpoint = '/api/canva-webhook';
    }
    
    async getDesignContent(designId) {
        // This would integrate with Canva's API in production
        try {
            const response = await fetch(`https://api.canva.com/v1/designs/${designId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error fetching Canva content:', error);
        }
        return null;
    }
    
    async publishDesign(designId, targetElement) {
        const content = await this.getDesignContent(designId);
        if (content && targetElement) {
            // Process and display the Canva content
            targetElement.innerHTML = content.html || content.url;
        }
    }
    
    setupWebhook() {
        // In production, this would set up webhook handling for automatic publishing
        console.log('Canva webhook setup would go here');
    }
}

/**
 * Newsletter and Communication
 */

class NewsletterManager {
    constructor() {
        this.setupNewsletterSignup();
    }
    
    setupNewsletterSignup() {
        const newsletterForms = document.querySelectorAll('.newsletter-signup');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', this.handleNewsletterSignup.bind(this));
        });
    }
    
    async handleNewsletterSignup(event) {
        event.preventDefault();
        const form = event.target;
        const email = form.querySelector('input[type="email"]').value;
        
        try {
            // In production, this would integrate with your email service
            const response = await fetch('/api/newsletter-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            if (response.ok) {
                this.showMessage('Thank you for subscribing!', 'success');
                form.reset();
            } else {
                throw new Error('Signup failed');
            }
        } catch (error) {
            this.showMessage('There was an error. Please try again.', 'error');
        }
    }
    
    showMessage(message, type) {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

/**
 * Global Functions
 */

// Open sponsor link
function openSponsorLink(url) {
    if (url && url !== '#') {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

// Open event link
function openEventLink(url) {
    if (url && url !== '#') {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

// Load event data (called from HTML)
function loadEventData() {
    if (window.eventManager) {
        window.eventManager.loadEvents();
    }
}

// Load sponsor data (called from HTML)
function loadSponsorData() {
    if (window.sponsorManager) {
        window.sponsorManager.loadSponsors();
    }
}

/**
 * Performance Optimization
 */

// Optimize carousel performance
function optimizeCarousel() {
    const carousel = document.querySelector('.platinum-carousel');
    if (!carousel) return;
    
    // Pause animation when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const track = entry.target.querySelector('.platinum-track');
            if (track) {
                if (entry.isIntersecting) {
                    track.style.animationPlayState = 'running';
                } else {
                    track.style.animationPlayState = 'paused';
                }
            }
        });
    });
    
    observer.observe(carousel);
}

/**
 * Accessibility Enhancements
 */

function enhanceAccessibility() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        transition: top 0.3s;
        z-index: 10000;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark if not present
    const main = document.querySelector('main');
    if (main && !main.id) {
        main.id = 'main-content';
    }
}

/**
 * Error Handling
 */

function handleGlobalErrors() {
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        // In production, you might want to send this to an error tracking service
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason);
        // In production, you might want to send this to an error tracking service
    });
}

/**
 * Initialization
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('BMV PTSA Main JavaScript loaded');
    
    // Initialize managers
    window.sponsorManager = new SponsorManager();
    window.eventManager = new EventManager();
    window.canvaIntegration = new CanvaIntegration();
    window.newsletterManager = new NewsletterManager();
    
    // Initialize features
    lazyLoadImages();
    optimizeCarousel();
    enhanceAccessibility();
    handleGlobalErrors();
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        });
    }
});

// Export for global access
window.BMVSite = {
    config: SITE_CONFIG,
    scrollTo: scrollToElement,
    formatDate: formatEventDate,
    openSponsor: openSponsorLink,
    openEvent: openEventLink
};
