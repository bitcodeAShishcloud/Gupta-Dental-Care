// =====================================================
// Gupta Dental Care - JavaScript Functionality
// =====================================================

// Language state
let currentLanguage = 'en';

// ==================== Document Ready ====================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize features
    initNavbar();
    initSmoothScroll();
    initScrollAnimations();
    initActiveNavLinks();
    loadOffers();
    initOfferTimers();
    
    console.log('Gupta Dental Care website loaded successfully!');
});

// ==================== Navbar Functionality ====================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });
}

// ==================== Smooth Scrolling ====================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Ignore empty hash and non-section links
            if (href === '#' || href === '#!') {
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== Active Navigation Links ====================
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==================== Language Toggle ====================
function toggleLanguage() {
    // Toggle language state
    currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
    
    // Update body attribute for font family
    document.body.setAttribute('data-lang', currentLanguage);
    
    // Update button text
    const langText = document.getElementById('lang-text');
    langText.textContent = currentLanguage === 'en' ? 'हिंदी' : 'English';
    
    // Update all bilingual content
    updateContent();
    
    // Store preference
    localStorage.setItem('preferredLanguage', currentLanguage);
    
    // Show notification
    showNotification(currentLanguage === 'en' ? 'Language changed to English' : 'भाषा हिंदी में बदल गई');
}

// ==================== Update Content ====================
function updateContent() {
    const elements = document.querySelectorAll('[data-en][data-hi]');
    
    elements.forEach(element => {
        const englishText = element.getAttribute('data-en');
        const hindiText = element.getAttribute('data-hi');
        
        if (currentLanguage === 'en') {
            element.textContent = englishText;
        } else {
            element.textContent = hindiText;
        }
    });
}

// ==================== Notification System ====================
function showNotification(message) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.custom-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #0d6efd, #00a8e8);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 50px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        font-weight: 500;
        animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ==================== Scroll Animations ====================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => observer.observe(card));
    
    // Observe offer cards
    const offerCards = document.querySelectorAll('.offer-card');
    offerCards.forEach(card => observer.observe(card));
    
    // Observe testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => observer.observe(card));
    
    // Observe gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => observer.observe(item));
    
    // Observe contact cards
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach(card => observer.observe(card));
}

// ==================== Load Saved Language Preference ====================
window.addEventListener('load', function() {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    
    if (savedLanguage && savedLanguage !== currentLanguage) {
        currentLanguage = savedLanguage;
        document.body.setAttribute('data-lang', currentLanguage);
        
        const langText = document.getElementById('lang-text');
        langText.textContent = currentLanguage === 'en' ? 'हिंदी' : 'English';
        
        updateContent();
    }
});

// ==================== Gallery Image Modal (Optional Enhancement) ====================
function initGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach(img => {
        img.addEventListener('click', function() {
            // Create modal overlay
            const modal = document.createElement('div');
            modal.className = 'gallery-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
            `;
            
            // Create image
            const modalImg = document.createElement('img');
            modalImg.src = this.src;
            modalImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                border-radius: 10px;
                box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
            `;
            
            modal.appendChild(modalImg);
            document.body.appendChild(modal);
            
            // Close on click
            modal.addEventListener('click', function() {
                modal.remove();
            });
            
            // Close on ESC key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    modal.remove();
                }
            });
        });
    });
}

// Initialize gallery modal
initGalleryModal();

// ==================== Scroll to Top Button ====================
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 150px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0d6efd, #00a8e8);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 998;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    scrollBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    scrollBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// Initialize scroll to top button
initScrollToTop();

// ==================== Form Validation (If needed in future) ====================
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// ==================== Animation for notification ====================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== WhatsApp Click Tracking ====================
const whatsappBtn = document.querySelector('.whatsapp-btn');
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', function() {
        console.log('WhatsApp button clicked');
    });
}

// ==================== Call Button Click Tracking ====================
const callBtn = document.querySelector('.call-btn');
if (callBtn) {
    callBtn.addEventListener('click', function() {
        console.log('Call button clicked');
    });
}

// ==================== Performance Optimization ====================
// Lazy load images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ==================== Service Worker Registration (Optional for PWA) ====================
if ('serviceWorker' in navigator) {
    // Uncomment to enable service worker
    // navigator.serviceWorker.register('/sw.js')
    //     .then(reg => console.log('Service Worker registered', reg))
    //     .catch(err => console.log('Service Worker registration failed', err));
}

// ==================== Console Welcome Message ====================
console.log('%c Welcome to Gupta Dental Care! ', 'background: #0d6efd; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
console.log('%c For inquiries, call: +91 98765 43210 ', 'color: #0d6efd; font-size: 14px;');

// ==================== Load and Display Offers ====================
function loadOffers() {
    const offersData = localStorage.getItem('dentalOffers');
    const offersContainer = document.getElementById('offersContainer');
    const noOffersMessage = document.getElementById('noOffersMessage');
    
    if (!offersData) {
        if (noOffersMessage) noOffersMessage.style.display = 'block';
        return;
    }
    
    const offers = JSON.parse(offersData);
    const now = new Date();
    
    // Filter active and non-expired offers
    const activeOffers = offers.filter(offer => {
        return offer.active && new Date(offer.endDate) >= now;
    });

    // Show a one-time popup per session when at least one live offer is available.
    maybeShowLiveOfferPopup(activeOffers);
    
    if (activeOffers.length === 0) {
        if (noOffersMessage) noOffersMessage.style.display = 'block';
        return;
    }
    
    if (noOffersMessage) noOffersMessage.style.display = 'none';
    
    offersContainer.innerHTML = activeOffers.map((offer, index) => {
        const isFeatured = offer.featured === true;
        const iconClass = offer.icon || 'fas fa-gift';
        
        return `
        <div class="col-lg-4 col-md-6">
            <div class="offer-card ${isFeatured ? 'offer-card-featured' : ''}">
                <div class="offer-badge ${isFeatured ? 'featured-badge' : ''}">
                    <span>${offer.badge || 'Special'}</span>
                </div>
                <div class="offer-timer" data-expire="${offer.endDate}" data-show-timer="true">
                    <div class="timer-content">
                        <span class="timer-label">Expires in</span>
                        <div class="timer-display">
                            <div class="timer-unit">
                                <span class="timer-value" data-unit="days">0</span>
                                <span class="timer-name">Days</span>
                            </div>
                            <div class="timer-unit">
                                <span class="timer-value" data-unit="hours">0</span>
                                <span class="timer-name">Hours</span>
                            </div>
                            <div class="timer-unit">
                                <span class="timer-value" data-unit="mins">0</span>
                                <span class="timer-name">Mins</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="offer-icon">
                    <i class="${iconClass}"></i>
                </div>
                <h4 class="offer-title">${offer.title}</h4>
                <div class="offer-discount">${offer.discount}% <span>OFF</span></div>
                <p class="offer-description">${offer.description}</p>
                <div class="offer-terms">
                    <small>${offer.terms || 'Limited time offer'}</small>
                </div>
                <button class="btn btn-offer ${isFeatured ? 'btn-offer-primary' : ''} w-100 mt-3" onclick="bookAppointment('${offer.title}')">
                    Book Now
                </button>
            </div>
        </div>
        `;
    }).join('');
}

function maybeShowLiveOfferPopup(activeOffers) {
    if (!activeOffers || activeOffers.length === 0) {
        return;
    }

    const popupShown = sessionStorage.getItem('liveOfferPopupShown');
    if (popupShown === 'true') {
        return;
    }

    showLiveOfferPopup(activeOffers[0]);
    sessionStorage.setItem('liveOfferPopupShown', 'true');
}

function showLiveOfferPopup(offer) {
    const existingPopup = document.querySelector('.live-offer-popup-backdrop');
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement('div');
    popup.className = 'live-offer-popup-backdrop';
    popup.innerHTML = `
        <div class="live-offer-popup" role="dialog" aria-modal="true" aria-label="Live Offer">
            <button class="live-offer-close" aria-label="Close live offer popup" onclick="closeLiveOfferPopup()">&times;</button>
            <p class="live-offer-status">Live Offer</p>
            <h4>${offer.title}</h4>
            <p class="live-offer-copy">${offer.description}</p>
            <div class="live-offer-pill">${offer.discount}% OFF</div>
            <div class="live-offer-code-wrap">
                <span>Code:</span>
                <strong>${offer.coupon}</strong>
            </div>
            <div class="live-offer-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="copyLiveOfferCode('${offer.coupon}')">
                    <i class="fas fa-copy me-1"></i>Copy Code
                </button>
                <button class="btn btn-sm btn-primary" onclick="bookWithOffer('${offer.coupon}'); closeLiveOfferPopup();">
                    <i class="fas fa-calendar-check me-1"></i>Book Now
                </button>
            </div>
        </div>
    `;

    popup.addEventListener('click', function(e) {
        if (e.target.classList.contains('live-offer-popup-backdrop')) {
            closeLiveOfferPopup();
        }
    });

    document.body.appendChild(popup);
}

function copyLiveOfferCode(code) {
    copyOfferCode(code);
}

function closeLiveOfferPopup() {
    const popup = document.querySelector('.live-offer-popup-backdrop');
    if (popup) {
        popup.remove();
    }
}

function formatOfferDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function copyOfferCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Coupon Code Copied!', `Use code "${code}" when booking your appointment`, 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

function bookWithOffer(couponCode) {
    // Scroll to contact section and pre-fill coupon
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Show notification
        showNotification('Ready to Book!', `Don't forget to mention coupon code: ${couponCode}`, 'info');
    }
}

function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `offer-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <strong>${title}</strong>
            <p>${message}</p>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ==================== Prevent Right Click on Images (Optional) ====================
// Uncomment to enable
// document.querySelectorAll('img').forEach(img => {
//     img.addEventListener('contextmenu', e => e.preventDefault());
// });

// ==================== Offer Booking Function ====================
function bookAppointment(offerType) {
    // Create a message based on offer type
    let message = `I'm interested in: ${offerType}`;
    let whatsappMessage = encodeURIComponent(`Hello Dr. A Gupta! I'm interested in the "${offerType}" offer. Can you please help me book an appointment?`);
    let phoneNumber = '+919984847807';
    
    // Show notification
    showNotification(currentLanguage === 'en' 
        ? `Great! Let's book your appointment for ${offerType}!` 
        : `बहुत अच्छा! आइए ${offerType} के लिए आपकी अपॉइंटमेंट बुक करें!`);
    
    // Open WhatsApp with message
    setTimeout(() => {
        window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=${whatsappMessage}`, '_blank');
    }, 500);
}

// ==================== Countdown Timer Management ====================
function initOfferTimers() {
    updateOfferTimers();
    // Update timers every second
    setInterval(updateOfferTimers, 1000);
}

function updateOfferTimers() {
    const timers = document.querySelectorAll('.offer-timer');
    
    timers.forEach(timer => {
        const expireDate = timer.dataset.expire;
        if (!expireDate) return;
        
        const expiryTime = new Date(expireDate).getTime();
        const currentTime = new Date().getTime();
        const timeRemaining = expiryTime - currentTime;
        
        if (timeRemaining <= 0) {
            // Offer expired
            timer.style.display = 'none';
            return;
        }
        
        // Calculate time units
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        
        // Update timer display
        const daysElement = timer.querySelector('[data-unit="days"]');
        const hoursElement = timer.querySelector('[data-unit="hours"]');
        const minsElement = timer.querySelector('[data-unit="mins"]');
        
        if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
        if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
        if (minsElement) minsElement.textContent = String(minutes).padStart(2, '0');
        
        // Add critical state when less than 12 hours remain
        if (timeRemaining < 12 * 60 * 60 * 1000) {
            timer.classList.add('timer-critical');
        } else {
            timer.classList.remove('timer-critical');
        }
    });
}

// ==================== Analytics Placeholder ====================
function trackEvent(eventName, eventData) {
    // Placeholder for Google Analytics or other analytics tools
    console.log('Event tracked:', eventName, eventData);
    
    // Example: gtag('event', eventName, eventData);
}

// Track page sections viewed
const sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('id');
            trackEvent('section_view', { section: sectionId });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

// ==================== Export functions for global use ====================
window.toggleLanguage = toggleLanguage;
window.showNotification = showNotification;
window.closeLiveOfferPopup = closeLiveOfferPopup;
window.copyLiveOfferCode = copyLiveOfferCode;

// ==================== Background Mode Default ====================
window.addEventListener('DOMContentLoaded', function() {
    const mode = localStorage.getItem('backgroundMode');
    if (!mode || mode === 'light') {
        document.body.classList.add('light-mode');
        document.documentElement.classList.add('light-mode');
        const bgText = document.getElementById('bg-mode-text');
        if (bgText) bgText.textContent = 'Dark Mode';
    } else if (mode === 'dark') {
        document.body.classList.remove('light-mode');
        document.documentElement.classList.remove('light-mode');
        const bgText = document.getElementById('bg-mode-text');
        if (bgText) bgText.textContent = 'Light Mode';
    }
});