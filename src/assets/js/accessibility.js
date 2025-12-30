/**
 * ONIONFORGE ACCESSIBILITY ENHANCEMENTS
 * ============================================================================
 * WCAG 2.1 AA compliant accessibility features.
 * Enhances keyboard navigation, screen reader support, and usability.
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
     * 1. CONFIGURATION
     * =========================================================================
     */
    const CONFIG = {
        FOCUS_RING_CLASS: 'focus-visible',
        REDUCED_MOTION_CLASS: 'reduced-motion',
        HIGH_CONTRAST_CLASS: 'high-contrast',
        FOCUS_TRAP_TIMEOUT: 150,
        SKIP_CONTENT_ID: 'skip-content-target'
    };
    
    /**
     * =========================================================================
     * 2. ACCESSIBILITY MANAGER CORE
     * =========================================================================
     */
    class AccessibilityManager {
        constructor() {
            this.preferences = {
                reducedMotion: false,
                highContrast: false,
                fontSize: 'medium',
                lineHeight: 'normal'
            };
            this.focusHistory = [];
            this.modalStack = [];
            this.init();
        }
        
        /**
         * Initialize accessibility features
         */
        init() {
            this.detectPreferences();
            this.setupFocusManagement();
            this.enhanceSemantics();
            this.setupKeyboardNavigation();
            this.setupLiveRegions();
            this.injectAccessibilityStyles();
            this.setupEventListeners();
            
            console.log('♿ Accessibility Manager initialized');
        }
        
        /**
         * Detect user preferences from system/browser
         */
        detectPreferences() {
            // Reduced motion preference
            this.preferences.reducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            ).matches;
            
            if (this.preferences.reducedMotion) {
                document.documentElement.classList.add(CONFIG.REDUCED_MOTION_CLASS);
            }
            
            // High contrast preference
            this.preferences.highContrast = window.matchMedia(
                '(prefers-contrast: high)'
            ).matches;
            
            if (this.preferences.highContrast) {
                document.documentElement.classList.add(CONFIG.HIGH_CONTRAST_CLASS);
            }
            
            // Save preferences for persistence
            this.savePreferences();
        }
        
        /**
         * Setup enhanced focus management
         */
        setupFocusManagement() {
            // Track focus history
            document.addEventListener('focusin', (event) => {
                this.focusHistory.push(event.target);
                
                // Keep only last 10 focus events
                if (this.focusHistory.length > 10) {
                    this.focusHistory.shift();
                }
            });
            
            // Add focus-visible polyfill behavior
            document.addEventListener('mousedown', () => {
                document.documentElement.classList.remove(CONFIG.FOCUS_RING_CLASS);
            });
            
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Tab' || event.key.includes('Arrow')) {
                    document.documentElement.classList.add(CONFIG.FOCUS_RING_CLASS);
                }
            });
            
            // Handle skip to content
            this.setupSkipToContent();
        }
        
        /**
         * Setup skip to content functionality
         */
        setupSkipToContent() {
            const skipLinks = document.querySelectorAll('.skip-link, a[href^="#"]');
            
            skipLinks.forEach(link => {
                link.addEventListener('click', (event) => {
                    const targetId = link.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        event.preventDefault();
                        
                        // Focus the target
                        targetElement.setAttribute('tabindex', '-1');
                        targetElement.focus();
                        
                        // Scroll to target
                        targetElement.scrollIntoView({
                            behavior: this.preferences.reducedMotion ? 'auto' : 'smooth',
                            block: 'start'
                        });
                        
                        // Announce to screen readers
                        this.announce(`Navigated to ${targetElement.getAttribute('aria-label') || targetElement.textContent.substring(0, 50)}`);
                    }
                });
            });
        }
        
        /**
         * Enhance semantic structure
         */
        enhanceSemantics() {
            // Add ARIA labels to interactive elements
            this.addAriaLabels();
            
            // Enhance form elements
            this.enhanceFormElements();
            
            // Add landmark roles
            this.addLandmarkRoles();
            
            // Ensure proper heading hierarchy
            this.validateHeadingHierarchy();
        }
        
        /**
         * Add ARIA labels to elements that need them
         */
        addAriaLabels() {
            // Buttons without text content
            document.querySelectorAll('button:not([aria-label]):empty').forEach(button => {
                const icon = button.querySelector('[aria-hidden]');
                if (icon) {
                    button.setAttribute('aria-label', icon.textContent || 'Button');
                }
            });
            
            // Links without descriptive text
            document.querySelectorAll('a[href]:not([aria-label])').forEach(link => {
                if (!link.textContent.trim() || link.textContent === '#' || link.textContent === '...') {
                    const href = link.getAttribute('href');
                    link.setAttribute('aria-label', `Link to ${href}`);
                }
            });
            
            // Images without alt text
            document.querySelectorAll('img:not([alt])').forEach(img => {
                img.setAttribute('alt', '');
                img.setAttribute('aria-hidden', 'true');
            });
        }
        
        /**
         * Enhance form elements accessibility
         */
        enhanceFormElements() {
            // Add error handling to form controls
            document.querySelectorAll('input, select, textarea').forEach(control => {
                const id = control.id || `input-${Math.random().toString(36).substr(2, 9)}`;
                if (!control.id) control.id = id;
                
                // Ensure associated label
                if (!control.hasAttribute('aria-label') && !control.hasAttribute('aria-labelledby')) {
                    let label = control.closest('label');
                    if (!label) {
                        label = document.querySelector(`label[for="${id}"]`);
                    }
                    
                    if (!label) {
                        const placeholder = control.getAttribute('placeholder');
                        if (placeholder) {
                            control.setAttribute('aria-label', placeholder);
                        }
                    }
                }
                
                // Add error message container
                if (!control.hasAttribute('aria-describedby')) {
                    const errorId = `${id}-error`;
                    const errorSpan = document.createElement('span');
                    errorSpan.id = errorId;
                    errorSpan.className = 'error-message sr-only';
                    errorSpan.setAttribute('aria-live', 'polite');
                    control.parentNode.insertBefore(errorSpan, control.nextSibling);
                    control.setAttribute('aria-describedby', errorId);
                }
            });
        }
        
        /**
         * Add landmark roles to sections
         */
        addLandmarkRoles() {
            // Main content area
            const main = document.querySelector('main');
            if (main && !main.getAttribute('role')) {
                main.setAttribute('role', 'main');
            }
            
            // Navigation areas
            document.querySelectorAll('nav').forEach(nav => {
                if (!nav.getAttribute('role')) {
                    nav.setAttribute('role', 'navigation');
                }
                if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
                    const heading = nav.querySelector('h1, h2, h3, h4, h5, h6');
                    if (heading) {
                        const headingId = heading.id || `heading-${Math.random().toString(36).substr(2, 9)}`;
                        if (!heading.id) heading.id = headingId;
                        nav.setAttribute('aria-labelledby', headingId);
                    } else {
                        nav.setAttribute('aria-label', 'Navigation');
                    }
                }
            });
            
            // Footer
            const footer = document.querySelector('footer');
            if (footer && !footer.getAttribute('role')) {
                footer.setAttribute('role', 'contentinfo');
            }
            
            // Search form
            const searchForm = document.querySelector('form[role="search"]');
            if (searchForm && !searchForm.getAttribute('role')) {
                searchForm.setAttribute('role', 'search');
            }
        }
        
        /**
         * Validate heading hierarchy
         */
        validateHeadingHierarchy() {
            const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
            let lastLevel = 0;
            let errors = [];
            
            headings.forEach((heading, index) => {
                const level = parseInt(heading.tagName.substring(1));
                
                // Check for skipped levels
                if (level > lastLevel + 1 && lastLevel > 0) {
                    errors.push(`Heading level skipped from h${lastLevel} to h${level} at position ${index}`);
                }
                
                lastLevel = level;
            });
            
            if (errors.length > 0) {
                console.warn('Heading hierarchy issues:', errors);
            }
        }
        
        /**
         * Setup enhanced keyboard navigation
         */
        setupKeyboardNavigation() {
            // Handle arrow key navigation in lists
            document.addEventListener('keydown', (event) => {
                const target = event.target;
                
                // Arrow navigation in lists
                if (target.matches('ul li, ol li, [role="listitem"]')) {
                    const list = target.closest('ul, ol, [role="list"]');
                    const items = Array.from(list.querySelectorAll('li, [role="listitem"]'));
                    const currentIndex = items.indexOf(target);
                    
                    let nextIndex = currentIndex;
                    
                    switch (event.key) {
                        case 'ArrowDown':
                        case 'ArrowRight':
                            nextIndex = Math.min(currentIndex + 1, items.length - 1);
                            break;
                        case 'ArrowUp':
                        case 'ArrowLeft':
                            nextIndex = Math.max(currentIndex - 1, 0);
                            break;
                        case 'Home':
                            nextIndex = 0;
                            break;
                        case 'End':
                            nextIndex = items.length - 1;
                            break;
                    }
                    
                    if (nextIndex !== currentIndex && items[nextIndex]) {
                        event.preventDefault();
                        items[nextIndex].focus();
                    }
                }
                
                // Escape key closes modals/dropdowns
                if (event.key === 'Escape') {
                    this.closeTopModal();
                }
                
                // Enter/Space key activation
                if ((event.key === 'Enter' || event.key === ' ') && 
                    target.matches('[role="button"], [role="tab"]')) {
                    event.preventDefault();
                    target.click();
                }
            });
            
            // Trap focus in modals
            this.setupFocusTrapping();
        }
        
        /**
         * Setup focus trapping for modals
         */
        setupFocusTrapping() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.matches('[role="dialog"], .modal')) {
                            this.trapFocus(node);
                            this.modalStack.push(node);
                        }
                    });
                    
                    mutation.removedNodes.forEach((node) => {
                        if (node.nodeType === 1 && node.matches('[role="dialog"], .modal')) {
                            const index = this.modalStack.indexOf(node);
                            if (index > -1) {
                                this.modalStack.splice(index, 1);
                            }
                            this.restoreFocus();
                        }
                    });
                });
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
        }
        
        /**
         * Trap focus within an element
         */
        trapFocus(element) {
            const focusableElements = element.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) return;
            
            const firstFocusable = focusableElements[0];
            const lastFocusable = focusableElements[focusableElements.length - 1];
            
            element.addEventListener('keydown', (event) => {
                if (event.key !== 'Tab') return;
                
                if (event.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstFocusable) {
                        event.preventDefault();
                        lastFocusable.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastFocusable) {
                        event.preventDefault();
                        firstFocusable.focus();
                    }
                }
            });
            
            // Focus first element
            setTimeout(() => firstFocusable.focus(), CONFIG.FOCUS_TRAP_TIMEOUT);
        }
        
        /**
         * Restore focus after modal closes
         */
        restoreFocus() {
            if (this.focusHistory.length > 0) {
                const lastFocused = this.focusHistory[this.focusHistory.length - 1];
                if (lastFocused && document.body.contains(lastFocused)) {
                    setTimeout(() => lastFocused.focus(), CONFIG.FOCUS_TRAP_TIMEOUT);
                }
            }
        }
        
        /**
         * Close the top modal in stack
         */
        closeTopModal() {
            if (this.modalStack.length > 0) {
                const topModal = this.modalStack[this.modalStack.length - 1];
                const closeButton = topModal.querySelector('[aria-label*="close"], [data-dismiss="modal"]');
                
                if (closeButton) {
                    closeButton.click();
                } else {
                    topModal.style.display = 'none';
                    topModal.setAttribute('aria-hidden', 'true');
                    this.modalStack.pop();
                    this.restoreFocus();
                }
            }
        }
        
        /**
         * Setup live regions for dynamic content
         */
        setupLiveRegions() {
            // Create assertive live region
            const assertiveRegion = document.createElement('div');
            assertiveRegion.setAttribute('aria-live', 'assertive');
            assertiveRegion.setAttribute('aria-atomic', 'true');
            assertiveRegion.className = 'sr-only';
            assertiveRegion.id = 'assertive-live-region';
            
            // Create polite live region
            const politeRegion = document.createElement('div');
            politeRegion.setAttribute('aria-live', 'polite');
            politeRegion.setAttribute('aria-atomic', 'true');
            politeRegion.className = 'sr-only';
            politeRegion.id = 'polite-live-region';
            
            document.body.appendChild(assertiveRegion);
            document.body.appendChild(politeRegion);
            
            // Observe DOM changes for live region updates
            this.setupDOMMutationObserver();
        }
        
        /**
         * Setup DOM mutation observer for accessibility
         */
        setupDOMMutationObserver() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    // Check for added nodes with accessibility implications
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            // Auto-announce new content in live regions
                            if (node.hasAttribute('aria-live')) {
                                this.announce(node.textContent, node.getAttribute('aria-live'));
                            }
                            
                            // Enhance new elements
                            this.enhanceElement(node);
                        }
                    });
                });
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });
        }
        
        /**
         * Enhance a single element's accessibility
         */
        enhanceElement(element) {
            // Add ARIA labels to new buttons
            if (element.tagName === 'BUTTON' && !element.getAttribute('aria-label')) {
                const text = element.textContent.trim();
                if (text) {
                    element.setAttribute('aria-label', text);
                }
            }
            
            // Add role to new navigation elements
            if (element.tagName === 'NAV' && !element.getAttribute('role')) {
                element.setAttribute('role', 'navigation');
            }
            
            // Enhance new form elements
            if (element.matches('input, select, textarea')) {
                this.enhanceFormElement(element);
            }
        }
        
        /**
         * Enhance a single form element
         */
        enhanceFormElement(element) {
            if (!element.id) {
                element.id = `input-${Math.random().toString(36).substr(2, 9)}`;
            }
            
            if (!element.hasAttribute('aria-label') && 
                !element.hasAttribute('aria-labelledby')) {
                const label = element.closest('label') || 
                             document.querySelector(`label[for="${element.id}"]`);
                
                if (!label && element.getAttribute('placeholder')) {
                    element.setAttribute('aria-label', element.getAttribute('placeholder'));
                }
            }
        }
        
        /**
         * Announce message to screen readers
         */
        announce(message, politeness = 'polite') {
            if (!message || typeof message !== 'string') return;
            
            const regionId = politeness === 'assertive' ? 
                'assertive-live-region' : 'polite-live-region';
            const region = document.getElementById(regionId);
            
            if (region) {
                region.textContent = '';
                setTimeout(() => {
                    region.textContent = message;
                }, 100);
            }
        }
        
        /**
         * Inject accessibility styles
         */
        injectAccessibilityStyles() {
            const style = document.createElement('style');
            style.textContent = `
                /* Accessibility Styles */
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }
                
                .sr-only:focus,
                .sr-only:active {
                    position: static;
                    width: auto;
                    height: auto;
                    overflow: visible;
                    clip: auto;
                    white-space: normal;
                }
                
                .focus-visible :focus {
                    outline: 3px solid #7b3fe4;
                    outline-offset: 2px;
                }
                
                .reduced-motion * {
                    animation-duration: 0.001ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.001ms !important;
                }
                
                .high-contrast {
                    --color-primary: #0000ff;
                    --color-secondary: #008000;
                    --text-primary: #000000;
                    --text-secondary: #333333;
                }
                
                [aria-busy="true"] {
                    cursor: progress;
                }
                
                [aria-disabled="true"] {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                
                [aria-hidden="true"] {
                    display: none !important;
                }
                
                /* Focus styles for keyboard navigation */
                :focus-visible {
                    outline: 3px solid #7b3fe4;
                    outline-offset: 2px;
                }
                
                /* Skip link styles */
                .skip-link {
                    position: absolute;
                    top: -40px;
                    left: 10px;
                    background: #7b3fe4;
                    color: white;
                    padding: 10px;
                    text-decoration: none;
                    z-index: 1000;
                }
                
                .skip-link:focus {
                    top: 10px;
                }
                
                /* Error message styles */
                .error-message {
                    color: #f44336;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                }
                
                [aria-invalid="true"] {
                    border-color: #f44336;
                }
            `;
            
            document.head.appendChild(style);
        }
        
        /**
         * Setup event listeners for accessibility features
         */
        setupEventListeners() {
            // Listen for preference changes
            window.matchMedia('(prefers-reduced-motion: reduce)')
                .addEventListener('change', (event) => {
                    this.preferences.reducedMotion = event.matches;
                    document.documentElement.classList.toggle(
                        CONFIG.REDUCED_MOTION_CLASS, 
                        event.matches
                    );
                    this.savePreferences();
                });
            
            window.matchMedia('(prefers-contrast: high)')
                .addEventListener('change', (event) => {
                    this.preferences.highContrast = event.matches;
                    document.documentElement.classList.toggle(
                        CONFIG.HIGH_CONTRAST_CLASS, 
                        event.matches
                    );
                    this.savePreferences();
                });
            
            // Handle page visibility for screen reader announcements
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    this.announce('Page is now visible');
                }
            });
        }
        
        /**
         * Save accessibility preferences
         */
        savePreferences() {
            try {
                localStorage.setItem('onionforge_accessibility', JSON.stringify(this.preferences));
            } catch (error) {
                console.warn('Failed to save accessibility preferences:', error);
            }
        }
        
        /**
         * Load accessibility preferences
         */
        loadPreferences() {
            try {
                const saved = localStorage.getItem('onionforge_accessibility');
                if (saved) {
                    this.preferences = { ...this.preferences, ...JSON.parse(saved) };
                    return true;
                }
            } catch (error) {
                console.warn('Failed to load accessibility preferences:', error);
            }
            return false;
        }
        
        /**
         * Get current accessibility state
         */
        getState() {
            return {
                preferences: { ...this.preferences },
                focusHistory: this.focusHistory.map(el => ({
                    tagName: el.tagName,
                    id: el.id,
                    className: el.className
                })),
                modalStack: this.modalStack.length,
                timestamp: new Date().toISOString()
            };
        }
        
        /**
         * Run accessibility audit
         */
        audit() {
            const issues = [];
            
            // Check for images without alt text
            const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
            if (imagesWithoutAlt.length > 0) {
                issues.push({
                    type: 'IMAGE_MISSING_ALT',
                    count: imagesWithoutAlt.length,
                    elements: Array.from(imagesWithoutAlt).map(img => ({
                        src: img.src,
                        className: img.className
                    }))
                });
            }
            
            // Check for buttons without accessible labels
            const buttonsWithoutLabel = document.querySelectorAll(
                'button:not([aria-label]):not([aria-labelledby]):empty'
            );
            if (buttonsWithoutLabel.length > 0) {
                issues.push({
                    type: 'BUTTON_MISSING_LABEL',
                    count: buttonsWithoutLabel.length
                });
            }
            
            // Check for form elements without labels
            const formElementsWithoutLabel = document.querySelectorAll(
                'input:not([aria-label]):not([aria-labelledby]):not([type="hidden"]), ' +
                'select:not([aria-label]):not([aria-labelledby]), ' +
                'textarea:not([aria-label]):not([aria-labelledby])'
            );
            if (formElementsWithoutLabel.length > 0) {
                issues.push({
                    type: 'FORM_ELEMENT_MISSING_LABEL',
                    count: formElementsWithoutLabel.length
                });
            }
            
            // Check color contrast (simplified)
            const lowContrastElements = this.checkColorContrast();
            if (lowContrastElements.length > 0) {
                issues.push({
                    type: 'LOW_COLOR_CONTRAST',
                    count: lowContrastElements.length,
                    elements: lowContrastElements
                });
            }
            
            return {
                timestamp: new Date().toISOString(),
                totalIssues: issues.reduce((sum, issue) => sum + issue.count, 0),
                issues: issues,
                score: this.calculateAccessibilityScore(issues)
            };
        }
        
        /**
         * Simplified color contrast check
         */
        checkColorContrast() {
            const elements = [];
            
            // Check text color contrast
            document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, a, li').forEach(el => {
                const style = window.getComputedStyle(el);
                const color = style.color;
                const bgColor = style.backgroundColor;
                
                // Simplified check - in production, use a proper contrast checking library
                if (color && bgColor && color === bgColor) {
                    elements.push({
                        element: el.tagName,
                        className: el.className,
                        text: el.textContent.substring(0, 50)
                    });
                }
            });
            
            return elements;
        }
        
        /**
         * Calculate accessibility score
         */
        calculateAccessibilityScore(issues) {
            const totalChecks = 4; // Number of checks we perform
            const issuesFound = issues.length;
            const score = Math.max(0, 100 - (issuesFound / totalChecks) * 100);
            
            return {
                percentage: Math.round(score),
                grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
                timestamp: new Date().toISOString()
            };
        }
        
        /**
         * Cleanup method
         */
        destroy() {
            // Remove injected styles
            const style = document.querySelector('style[data-accessibility]');
            if (style) style.remove();
            
            // Remove live regions
            const regions = document.querySelectorAll('#assertive-live-region, #polite-live-region');
            regions.forEach(region => region.remove());
            
            console.log('Accessibility Manager destroyed');
        }
    }
    
    /**
     * =========================================================================
     * 3. PUBLIC API & INITIALIZATION
     * =========================================================================
     */
    
    // Global accessibility instance
    let accessibilityInstance = null;
    
    /**
     * Initialize accessibility features
     */
    function initAccessibility() {
        if (accessibilityInstance) {
            console.warn('Accessibility already initialized');
            return accessibilityInstance;
        }
        
        try {
            accessibilityInstance = new AccessibilityManager();
            
            // Export for debugging and external access
            if (typeof window !== 'undefined') {
                window.OnionForgeAccessibility = {
                    getInstance: () => accessibilityInstance,
                    getState: () => accessibilityInstance?.getState() || null,
                    audit: () => accessibilityInstance?.audit() || null,
                    announce: (message, politeness) => 
                        accessibilityInstance?.announce(message, politeness),
                    version: '2.0.0'
                };
            }
            
            return accessibilityInstance;
        } catch (error) {
            console.error('Failed to initialize accessibility:', error);
            return null;
        }
    }
    
    /**
     * Auto-initialize accessibility
     */
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(initAccessibility, 100);
            });
        } else {
            setTimeout(initAccessibility, 100);
        }
    }
    
    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            init: initAccessibility,
            AccessibilityManager
        };
    }
    
    // Self-executing function returns public API
    return {
        init: initAccessibility,
        version: '2.0.0',
        WCAG_VERSION: '2.1 AA'
    };
})();