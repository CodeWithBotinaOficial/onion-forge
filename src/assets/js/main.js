/**
 * ONIONFORGE MAIN APPLICATION SCRIPT
 * ============================================================================
 * Core application functionality, navigation, and UI interactions.
 * Follows strict security and privacy principles.
 * 
 * @version 2.0.0
 * @author CodeWithBotinaOficial
 * @license MIT
 * ============================================================================
 */

(function() {
    'use strict';
    
    /**
     * =========================================================================
     * 1. CONFIGURATION & CONSTANTS
     * =========================================================================
     */
    const CONFIG = {
        LOCAL_STORAGE_KEY: 'onionforge_preferences',
        SCROLL_THRESHOLD: 100,
        MOBILE_BREAKPOINT: 768,
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 150
    };
    
    /**
     * =========================================================================
     * 2. UTILITY FUNCTIONS
     * =========================================================================
     */
    class Utils {
        /**
         * Debounce function to limit execution rate
         */
        static debounce(func, wait) {
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
        
        /**
         * Throttle function to limit execution rate
         */
        static throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
        
        /**
         * Check if device is mobile
         */
        static isMobile() {
            return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
        }
        
        /**
         * Check if user prefers reduced motion
         */
        static prefersReducedMotion() {
            return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
        
        /**
         * Safe query selector with null check
         */
        static $(selector, parent = document) {
            const element = parent.querySelector(selector);
            if (!element) {
                console.warn(`Element not found: ${selector}`);
            }
            return element;
        }
        
        /**
         * Safe query selector all
         */
        static $$(selector, parent = document) {
            return Array.from(parent.querySelectorAll(selector));
        }
        
        /**
         * Add event listener with error handling
         */
        static on(element, event, handler, options = {}) {
            if (!element) {
                console.warn('Cannot add event listener to null element');
                return () => {};
            }
            
            const wrappedHandler = (e) => {
                try {
                    handler(e);
                } catch (error) {
                    console.error('Event handler error:', error);
                }
            };
            
            element.addEventListener(event, wrappedHandler, options);
            
            // Return cleanup function
            return () => element.removeEventListener(event, wrappedHandler, options);
        }
        
        /**
         * Smooth scroll to element
         */
        static scrollToElement(element, offset = 100) {
            if (!element) return;
            
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: Utils.prefersReducedMotion() ? 'auto' : 'smooth'
            });
        }
        
        /**
         * Get current scroll position
         */
        static getScrollPosition() {
            return window.pageYOffset || document.documentElement.scrollTop;
        }
        
        /**
         * Check if element is in viewport
         */
        static isInViewport(element) {
            if (!element) return false;
            
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
        
        /**
         * Format bytes to human readable size
         */
        static formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
            
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
    }
    
    /**
     * =========================================================================
     * 3. PREFERENCE MANAGER
     * =========================================================================
     */
    class PreferenceManager {
        constructor() {
            this.key = CONFIG.LOCAL_STORAGE_KEY;
            this.preferences = this.loadPreferences();
        }
        
        /**
         * Load preferences from localStorage
         */
        loadPreferences() {
            try {
                const saved = localStorage.getItem(this.key);
                return saved ? JSON.parse(saved) : {};
            } catch (error) {
                console.warn('Failed to load preferences:', error);
                return {};
            }
        }
        
        /**
         * Save preferences to localStorage
         */
        savePreferences() {
            try {
                localStorage.setItem(this.key, JSON.stringify(this.preferences));
                return true;
            } catch (error) {
                console.warn('Failed to save preferences:', error);
                return false;
            }
        }
        
        /**
         * Get a preference value
         */
        get(key, defaultValue = null) {
            return this.preferences[key] !== undefined ? this.preferences[key] : defaultValue;
        }
        
        /**
         * Set a preference value
         */
        set(key, value) {
            this.preferences[key] = value;
            return this.savePreferences();
        }
        
        /**
         * Remove a preference
         */
        remove(key) {
            delete this.preferences[key];
            return this.savePreferences();
        }
        
        /**
         * Clear all preferences
         */
        clear() {
            this.preferences = {};
            localStorage.removeItem(this.key);
            return true;
        }
        
        /**
         * Get all preferences (read-only)
         */
        getAll() {
            return { ...this.preferences };
        }
    }
    
    /**
     * =========================================================================
     * 4. NAVIGATION MANAGER
     * =========================================================================
     */
    class NavigationManager {
        constructor() {
            this.mobileMenuOpen = false;
            this.currentSection = null;
            this.sectionObservers = new Map();
            this.init();
        }
        
        /**
         * Initialize navigation
         */
        init() {
            this.cacheElements();
            this.bindEvents();
            this.setupIntersectionObserver();
            this.updateActiveSection();
        }
        
        /**
         * Cache DOM elements
         */
        cacheElements() {
            this.mobileMenuToggle = Utils.$('.mobile-menu-toggle');
            this.mainNav = Utils.$('.main-nav');
            this.navLinks = Utils.$$('.nav-link');
            this.sections = Utils.$$('section[id]');
        }
        
        /**
         * Bind navigation events
         */
        bindEvents() {
            // Mobile menu toggle
            if (this.mobileMenuToggle) {
                Utils.on(this.mobileMenuToggle, 'click', () => this.toggleMobileMenu());
            }
            
            // Navigation link clicks
            this.navLinks.forEach(link => {
                Utils.on(link, 'click', (e) => this.handleNavClick(e));
            });
            
            // Close mobile menu when clicking outside
            Utils.on(document, 'click', (e) => {
                if (this.mobileMenuOpen && 
                    !this.mainNav.contains(e.target) && 
                    !this.mobileMenuToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
            
            // Handle window resize
            Utils.on(window, 'resize', Utils.debounce(() => {
                if (!Utils.isMobile() && this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
            }, CONFIG.DEBOUNCE_DELAY));
            
            // Handle escape key
            Utils.on(document, 'keydown', (e) => {
                if (e.key === 'Escape' && this.mobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        }
        
        /**
         * Toggle mobile menu
         */
        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
            
            if (this.mobileMenuToggle) {
                this.mobileMenuToggle.setAttribute('aria-expanded', this.mobileMenuOpen);
                this.mobileMenuToggle.classList.toggle('active', this.mobileMenuOpen);
            }
            
            if (this.mainNav) {
                this.mainNav.classList.toggle('active', this.mobileMenuOpen);
            }
            
            // Update body scroll
            document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
            
            // Announce to screen readers
            this.announceToScreenReader(
                this.mobileMenuOpen ? 'Mobile menu opened' : 'Mobile menu closed'
            );
        }
        
        /**
         * Close mobile menu
         */
        closeMobileMenu() {
            if (!this.mobileMenuOpen) return;
            
            this.mobileMenuOpen = false;
            
            if (this.mobileMenuToggle) {
                this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
                this.mobileMenuToggle.classList.remove('active');
            }
            
            if (this.mainNav) {
                this.mainNav.classList.remove('active');
            }
            
            document.body.style.overflow = '';
        }
        
        /**
         * Handle navigation link click
         */
        handleNavClick(event) {
            event.preventDefault();
            
            const link = event.currentTarget;
            const targetId = link.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                const targetElement = Utils.$(targetId);
                if (targetElement) {
                    Utils.scrollToElement(targetElement, 80);
                }
            }
            
            // Close mobile menu after click
            if (Utils.isMobile()) {
                this.closeMobileMenu();
            }
            
            // Update active link
            this.setActiveLink(link);
        }
        
        /**
         * Set active navigation link
         */
        setActiveLink(activeLink) {
            this.navLinks.forEach(link => {
                link.classList.toggle('active', link === activeLink);
                link.setAttribute('aria-current', link === activeLink ? 'page' : null);
            });
        }
        
        /**
         * Setup intersection observer for section tracking
         */
        setupIntersectionObserver() {
            const options = {
                root: null,
                rootMargin: '-20% 0px -70% 0px',
                threshold: 0
            };
            
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.currentSection = entry.target.id;
                        this.updateActiveNavigation();
                        
                        // Trigger section observers
                        const callbacks = this.sectionObservers.get(entry.target.id);
                        if (callbacks) {
                            callbacks.forEach(callback => callback(entry.target));
                        }
                    }
                });
            }, options);
            
            // Observe all sections
            this.sections.forEach(section => {
                this.observer.observe(section);
            });
        }
        
        /**
         * Update active navigation based on current section
         */
        updateActiveNavigation() {
            if (!this.currentSection) return;
            
            const activeLink = Utils.$(`.nav-link[href="#${this.currentSection}"]`);
            if (activeLink) {
                this.setActiveLink(activeLink);
            }
        }
        
        /**
         * Register callback for section visibility
         */
        onSectionVisible(sectionId, callback) {
            if (!this.sectionObservers.has(sectionId)) {
                this.sectionObservers.set(sectionId, []);
            }
            this.sectionObservers.get(sectionId).push(callback);
        }
        
        /**
         * Update active section manually
         */
        updateActiveSection() {
            const scrollPosition = Utils.getScrollPosition();
            let currentSection = null;
            
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop - 100 && 
                    scrollPosition < sectionTop + sectionHeight - 100) {
                    currentSection = section.id;
                }
            });
            
            if (currentSection && currentSection !== this.currentSection) {
                this.currentSection = currentSection;
                this.updateActiveNavigation();
            }
        }
        
        /**
         * Announce message to screen readers
         */
        announceToScreenReader(message) {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', 'assertive');
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = message;
            
            document.body.appendChild(announcement);
            setTimeout(() => document.body.removeChild(announcement), 1000);
        }
    }
    
    /**
     * =========================================================================
     * 5. SCROLL MANAGER
     * =========================================================================
     */
    class ScrollManager {
        constructor() {
            this.lastScrollPosition = 0;
            this.scrollDirection = 'down';
            this.headerVisible = true;
            this.init();
        }
        
        /**
         * Initialize scroll management
         */
        init() {
            this.cacheElements();
            this.bindEvents();
            this.updateHeaderVisibility();
        }
        
        /**
         * Cache DOM elements
         */
        cacheElements() {
            this.siteHeader = Utils.$('.site-header');
        }
        
        /**
         * Bind scroll events
         */
        bindEvents() {
            Utils.on(window, 'scroll', Utils.throttle(() => {
                this.handleScroll();
            }, CONFIG.DEBOUNCE_DELAY));
        }
        
        /**
         * Handle scroll events
         */
        handleScroll() {
            const currentScroll = Utils.getScrollPosition();
            
            // Determine scroll direction
            this.scrollDirection = currentScroll > this.lastScrollPosition ? 'down' : 'up';
            this.lastScrollPosition = currentScroll;
            
            // Update header visibility
            this.updateHeaderVisibility();
            
            // Update scroll progress if needed
            this.updateScrollProgress(currentScroll);
            
            // Trigger scroll event for other components
            this.dispatchScrollEvent(currentScroll);
        }
        
        /**
         * Update header visibility based on scroll
         */
        updateHeaderVisibility() {
            if (!this.siteHeader) return;
            
            const currentScroll = Utils.getScrollPosition();
            const shouldHide = this.scrollDirection === 'down' && currentScroll > CONFIG.SCROLL_THRESHOLD;
            
            if (shouldHide !== !this.headerVisible) {
                this.headerVisible = !shouldHide;
                
                if (shouldHide) {
                    this.siteHeader.classList.add('header-hidden');
                    this.siteHeader.setAttribute('aria-hidden', 'true');
                } else {
                    this.siteHeader.classList.remove('header-hidden');
                    this.siteHeader.setAttribute('aria-hidden', 'false');
                }
            }
        }
        
        /**
         * Update scroll progress indicator
         */
        updateScrollProgress(scrollPosition) {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = scrollHeight > 0 ? (scrollPosition / scrollHeight) * 100 : 0;
            
            // Dispatch custom event with progress
            const event = new CustomEvent('scrollProgress', {
                detail: { percentage: scrollPercentage }
            });
            document.dispatchEvent(event);
        }
        
        /**
         * Dispatch scroll event for other components
         */
        dispatchScrollEvent(scrollPosition) {
            const event = new CustomEvent('appScroll', {
                detail: {
                    position: scrollPosition,
                    direction: this.scrollDirection,
                    threshold: CONFIG.SCROLL_THRESHOLD
                }
            });
            document.dispatchEvent(event);
        }
        
        /**
         * Scroll to top smoothly
         */
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: Utils.prefersReducedMotion() ? 'auto' : 'smooth'
            });
        }
    }
    
    /**
     * =========================================================================
     * 6. PERFORMANCE MONITOR
     * =========================================================================
     */
    class PerformanceMonitor {
        constructor() {
            this.metrics = {};
            this.init();
        }
        
        /**
         * Initialize performance monitoring
         */
        init() {
            this.recordInitialLoad();
            this.setupPerformanceObserver();
        }
        
        /**
         * Record initial page load metrics
         */
        recordInitialLoad() {
            if (window.performance && window.performance.timing) {
                const timing = window.performance.timing;
                
                this.metrics = {
                    pageLoadTime: timing.loadEventEnd - timing.navigationStart,
                    domReadyTime: timing.domContentLoadedEventEnd - timing.navigationStart,
                    ttfb: timing.responseStart - timing.requestStart,
                    pageSize: this.getPageSize(),
                    timestamp: new Date().toISOString()
                };
            }
        }
        
        /**
         * Get approximate page size
         */
        getPageSize() {
            let totalBytes = 0;
            
            // Calculate HTML size
            totalBytes += new TextEncoder().encode(document.documentElement.outerHTML).length;
            
            // Calculate CSS size
            document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                try {
                    const css = link.sheet;
                    if (css) {
                        totalBytes += new TextEncoder().encode(
                            Array.from(css.cssRules)
                                .map(rule => rule.cssText)
                                .join('')
                        ).length;
                    }
                } catch (e) {
                    // Cross-origin stylesheets may throw
                }
            });
            
            // Calculate inline script sizes
            document.querySelectorAll('script').forEach(script => {
                if (script.src) {
                    // External script - can't measure without CORS
                } else {
                    totalBytes += new TextEncoder().encode(script.textContent).length;
                }
            });
            
            return Utils.formatBytes(totalBytes);
        }
        
        /**
         * Setup Performance Observer for monitoring
         */
        setupPerformanceObserver() {
            if ('PerformanceObserver' in window) {
                try {
                    // Observe long tasks
                    const longTaskObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        entries.forEach(entry => {
                            if (entry.duration > 50) {
                                console.warn('Long task detected:', entry);
                            }
                        });
                    });
                    
                    longTaskObserver.observe({ entryTypes: ['longtask'] });
                    
                    // Observe layout shifts
                    const layoutShiftObserver = new PerformanceObserver((list) => {
                        const entries = list.getEntries();
                        let totalShift = 0;
                        
                        entries.forEach(entry => {
                            if (!entry.hadRecentInput) {
                                totalShift += entry.value;
                            }
                        });
                        
                        if (totalShift > 0.1) {
                            console.warn('Cumulative Layout Shift:', totalShift);
                        }
                    });
                    
                    layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
                    
                } catch (error) {
                    console.warn('Performance Observer not supported:', error);
                }
            }
        }
        
        /**
         * Get performance metrics
         */
        getMetrics() {
            return { ...this.metrics };
        }
        
        /**
         * Log performance metrics
         */
        logMetrics() {
            console.group('📊 OnionForge Performance Metrics');
            console.table(this.metrics);
            console.groupEnd();
        }
    }
    
    /**
     * =========================================================================
     * 7. APPLICATION CORE
     * =========================================================================
     */
    class OnionForgeApp {
        constructor() {
            this.utils = Utils;
            this.preferences = new PreferenceManager();
            this.navigation = new NavigationManager();
            this.scrollManager = new ScrollManager();
            this.performance = new PerformanceMonitor();
            this.components = new Map();
            this.init();
        }
        
        /**
         * Initialize application
         */
        init() {
            console.log(
                '%c🧅 OnionForge v2.0.0\n%cSecure .onion Platform for Education',
                'color: #7b3fe4; font-size: 16px; font-weight: bold;',
                'color: #00d4aa; font-size: 12px;'
            );
            
            this.setupComponents();
            this.bindGlobalEvents();
            this.setupServiceWorker();
            this.logSecurityVerification();
            
            // Dispatch app ready event
            document.dispatchEvent(new CustomEvent('appReady'));
        }
        
        /**
         * Setup application components
         */
        setupComponents() {
            // Initialize components here
            this.components.set('preferences', this.preferences);
            this.components.set('navigation', this.navigation);
            this.components.set('scroll', this.scrollManager);
            this.components.set('performance', this.performance);
        }
        
        /**
         * Bind global application events
         */
        bindGlobalEvents() {
            // Handle external links
            Utils.on(document, 'click', (e) => {
                const link = e.target.closest('a[href^="http"]');
                if (link && !link.href.includes(window.location.hostname)) {
                    this.handleExternalLink(link, e);
                }
            });
            
            // Handle print
            Utils.on(window, 'beforeprint', () => {
                document.body.classList.add('printing');
            });
            
            Utils.on(window, 'afterprint', () => {
                document.body.classList.remove('printing');
            });
            
            // Handle visibility change
            Utils.on(document, 'visibilitychange', () => {
                if (document.hidden) {
                    document.dispatchEvent(new CustomEvent('appBackground'));
                } else {
                    document.dispatchEvent(new CustomEvent('appForeground'));
                }
            });
        }
        
        /**
         * Handle external links (security)
         */
        handleExternalLink(link, event) {
            // Add security attributes
            link.setAttribute('rel', 'noopener noreferrer');
            link.setAttribute('target', '_blank');
            
            // Log external link click (non-identifying)
            console.log('External link clicked:', {
                href: link.href,
                text: link.textContent.substring(0, 50),
                timestamp: new Date().toISOString()
            });
        }
        
        /**
         * Setup Service Worker for offline capability
         */
        setupServiceWorker() {
            if ('serviceWorker' in navigator && location.protocol === 'https:') {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                        .then(registration => {
                            console.log('ServiceWorker registered:', registration.scope);
                        })
                        .catch(error => {
                            console.log('ServiceWorker registration failed:', error);
                        });
                });
            }
        }
        
        /**
         * Log security verification
         */
        logSecurityVerification() {
            const securityReport = {
                timestamp: new Date().toISOString(),
                localStorage: !!window.localStorage,
                serviceWorker: 'serviceWorker' in navigator,
                https: location.protocol === 'https:',
                cookies: navigator.cookieEnabled,
                doNotTrack: navigator.doNotTrack || 'unspecified',
                privacy: {
                    noAnalytics: true,
                    noTracking: true,
                    noCookies: true,
                    noThirdParty: true
                }
            };
            
            console.group('🔒 Security Verification');
            console.table(securityReport);
            console.groupEnd();
        }
        
        /**
         * Get application state
         */
        getState() {
            return {
                version: '2.0.0',
                timestamp: new Date().toISOString(),
                preferences: this.preferences.getAll(),
                performance: this.performance.getMetrics(),
                navigation: {
                    currentSection: this.navigation.currentSection,
                    mobileMenuOpen: this.navigation.mobileMenuOpen
                },
                scroll: {
                    position: Utils.getScrollPosition(),
                    direction: this.scrollManager.scrollDirection
                }
            };
        }
        
        /**
         * Get component by name
         */
        getComponent(name) {
            return this.components.get(name);
        }
        
        /**
         * Register new component
         */
        registerComponent(name, component) {
            if (this.components.has(name)) {
                console.warn(`Component "${name}" already exists, replacing.`);
            }
            this.components.set(name, component);
            return true;
        }
        
        /**
         * Application teardown (cleanup)
         */
        destroy() {
            // Cleanup all components
            this.components.forEach((component, name) => {
                if (typeof component.destroy === 'function') {
                    component.destroy();
                }
            });
            
            // Clear all intervals and timeouts
            const maxId = setTimeout(() => {}, 0);
            for (let i = 0; i < maxId; i++) {
                clearTimeout(i);
            }
            
            console.log('OnionForge application destroyed');
        }
    }
    
    /**
     * =========================================================================
     * 8. PUBLIC API & INITIALIZATION
     * =========================================================================
     */
    
    // Global application instance
    let appInstance = null;
    
    /**
     * Initialize the application
     */
    function initApplication() {
        if (appInstance) {
            console.warn('Application already initialized');
            return appInstance;
        }
        
        try {
            appInstance = new OnionForgeApp();
            
            // Export for debugging and external access
            if (typeof window !== 'undefined') {
                window.OnionForgeApp = {
                    getInstance: () => appInstance,
                    getState: () => appInstance?.getState() || null,
                    version: '2.0.0',
                    utils: Utils
                };
            }
            
            return appInstance;
        } catch (error) {
            console.error('Failed to initialize application:', error);
            return null;
        }
    }
    
    /**
     * Auto-initialize application
     */
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        // Use requestIdleCallback for non-critical initialization
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => {
                setTimeout(initApplication, 0);
            });
        } else {
            // Fallback for older browsers
            window.addEventListener('load', () => {
                setTimeout(initApplication, 100);
            });
        }
    }
    
    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            init: initApplication,
            Utils,
            PreferenceManager,
            NavigationManager,
            ScrollManager,
            PerformanceMonitor,
            OnionForgeApp
        };
    }
    
    // Self-executing function returns public API
    return {
        init: initApplication,
        version: '2.0.0'
    };
})();