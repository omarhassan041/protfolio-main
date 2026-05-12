// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const submitText = document.getElementById('submit-text');
const submitSpinner = document.getElementById('submit-spinner');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const yearSpan = document.getElementById('year');
const formStatus = document.getElementById('form-status');

// Set current year
yearSpan.textContent = new Date().getFullYear();

// Theme Management
function updateThemeIcon(isDark) {
    const icon = isDark ? '☀️' : '🌙';
    const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    
    if (themeToggle) themeToggle.textContent = icon;
    if (themeToggleMobile) themeToggleMobile.textContent = icon;
    
    [themeToggle, themeToggleMobile].forEach(btn => {
        if (btn) btn.setAttribute('aria-label', label);
    });
}

function setTheme(theme) {
    const html = document.documentElement;
    
    if (theme === 'dark') {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
    
    updateThemeIcon(theme === 'dark');
}

// Load saved theme or use system preference
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (systemPrefersDark) {
        setTheme('dark');
    } else {
        setTheme('light');
    }
}

// Mobile Menu
function toggleMobileMenu() {
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
        const isExpanded = !mobileMenu.classList.contains('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        
        // Update menu icon
        const menuIcon = mobileMenuBtn.querySelector('svg');
        if (menuIcon) {
            if (isExpanded) {
                menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
            } else {
                menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
            }
        }
    }
}

function closeMobileMenu() {
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        
        // Reset menu icon
        const menuIcon = mobileMenuBtn.querySelector('svg');
        if (menuIcon) {
            menuIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>';
        }
    }
}

// Form Handling
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Show loading state
    submitBtn.disabled = true;
    submitText.textContent = 'Sending...';
    submitSpinner.classList.remove('hidden');
    
    // Hide previous status messages
    if (formStatus) {
        formStatus.classList.add('hidden');
        formStatus.classList.remove('bg-green-100', 'text-green-700', 'border-green-200',
                                  'bg-red-100', 'text-red-700', 'border-red-200');
    }
    
    try {
        const formData = new FormData(contactForm);
        
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            // Success
            contactForm.reset();
            showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
            
            // Show success message in form
            if (formStatus) {
                formStatus.textContent = 'Thank you! Your message has been sent. I\'ll get back to you soon.';
                formStatus.classList.add('bg-green-100', 'text-green-700', 'border', 'border-green-200');
                formStatus.classList.remove('hidden');
            }
        } else {
            // Formspree error
            const data = await response.json();
            throw new Error(data.error || 'Failed to send message');
        }
    } catch (error) {
        console.error('Form Error:', error);
        showToast('Failed to send message. Please try again or email me directly.', 'error');
        
        // Show error message in form
        if (formStatus) {
            formStatus.textContent = 'Sorry, there was an error sending your message. Please try again or email me at hello@omar.dev';
            formStatus.classList.add('bg-red-100', 'text-red-700', 'border', 'border-red-200');
            formStatus.classList.remove('hidden');
        }
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitText.textContent = 'Send Message';
        submitSpinner.classList.add('hidden');
    }
}

// Toast Notification
function showToast(message, type = 'success') {
    if (!toast || !toastMessage) return;
    
    // Set message and style
    toastMessage.textContent = message;
    
    if (type === 'error') {
        toast.classList.remove('bg-green-500');
        toast.classList.add('bg-red-500');
    } else {
        toast.classList.remove('bg-red-500');
        toast.classList.add('bg-green-500');
    }
    
    // Show toast
    toast.classList.remove('translate-x-full');
    
    // Hide after 4 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full');
    }, 4000);
}

// Smooth Scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                closeMobileMenu();
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Update URL hash
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// Event Listeners
function initEventListeners() {
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? 'light' : 'dark');
        });
    }
    
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', () => {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? 'light' : 'dark');
            closeMobileMenu();
        });
    }
    
    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target) &&
            !mobileMenu.classList.contains('hidden')) {
            closeMobileMenu();
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    // Form submission (AJAX)
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Check if Formspree ID is still the placeholder
        const formAction = contactForm.getAttribute('action');
        if (formAction && formAction.includes('YOUR_FORMSPREE_FORM_ID')) {
            console.warn('⚠️ Please update your Formspree form ID in the contact form action attribute.');
            
            // Update form to show warning
            const warningDiv = document.createElement('div');
            warningDiv.className = 'bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-3 rounded-lg mb-4 text-sm';
            warningDiv.innerHTML = `
                <p class="font-semibold">⚠️ Form not configured</p>
                <p>Please replace "YOUR_FORMSPREE_FORM_ID" with your actual Formspree form ID in the form action attribute.</p>
                <p class="mt-2">
                    <a href="https://formspree.io/" target="_blank" class="underline">Get Formspree form ID</a>
                </p>
            `;
            contactForm.insertBefore(warningDiv, contactForm.firstChild);
        }
    }
    
    // Prevent form submission on Enter key in textarea
    if (contactForm) {
        contactForm.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName === 'TEXTAREA' && !e.shiftKey) {
                e.preventDefault();
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    initEventListeners();
    initSmoothScroll();
    initScrollAnimations();
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page is visible again, refresh theme
        loadTheme();
    }
});