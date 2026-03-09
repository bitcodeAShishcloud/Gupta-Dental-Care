// Admin Dashboard JavaScript

// Check authentication
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadDashboard();
});

function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'admin.html';
        return;
    }
    
    const username = sessionStorage.getItem('adminUsername');
    if (username) {
        document.getElementById('adminName').textContent = username;
    }
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminUsername');
    window.location.href = 'admin.html';
}

// Navigation
function showSection(section, clickedLink) {
    // Hide all sections
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('offersSection').style.display = 'none';
    document.getElementById('couponsSection').style.display = 'none';
    
    // Remove active class from all menu items
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
    
    // Show selected section
    if (section === 'dashboard') {
        document.getElementById('dashboardSection').style.display = 'block';
        loadDashboard();
    } else if (section === 'offers') {
        document.getElementById('offersSection').style.display = 'block';
        loadOffers();
    } else if (section === 'coupons') {
        document.getElementById('couponsSection').style.display = 'block';
        loadCoupons();
    }
    
    // Add active class to clicked menu item
    if (clickedLink) {
        clickedLink.classList.add('active');
    }

    // Prevent '#' navigation jump from inline onclick handlers.
    return false;
}

// Load Dashboard
function loadDashboard() {
    const offers = getOffers();
    const activeOffers = offers.filter(o => o.active && new Date(o.endDate) >= new Date());
    const totalCoupons = offers.length;
    const usedCoupons = offers.reduce((sum, o) => sum + (o.timesUsed || 0), 0);
    
    document.getElementById('activeOffersCount').textContent = activeOffers.length;
    document.getElementById('totalCouponsCount').textContent = totalCoupons;
    document.getElementById('usedCouponsCount').textContent = usedCoupons;
    
    // Show recent offers preview
    const previewHtml = activeOffers.slice(0, 3).map(offer => `
        <div class="offer-card active mb-2">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h6 class="mb-1">${offer.title}</h6>
                    <p class="mb-1 small text-muted">${offer.description}</p>
                    <span class="badge bg-success">${offer.discount}% OFF</span>
                    <span class="badge bg-primary">Code: ${offer.coupon}</span>
                </div>
                <small class="text-muted">Expires: ${formatDate(offer.endDate)}</small>
            </div>
        </div>
    `).join('');
    
    document.getElementById('recentOffersPreview').innerHTML = previewHtml || '<p class="text-muted">No active offers yet. Create your first offer!</p>';
}

// Get offers from localStorage
function getOffers() {
    const offers = localStorage.getItem('dentalOffers');
    return offers ? JSON.parse(offers) : [];
}

// Save offers to localStorage
function saveOffers(offers) {
    localStorage.setItem('dentalOffers', JSON.stringify(offers));
}

// Show Create Offer Modal
function showCreateOfferModal() {
    const modal = new bootstrap.Modal(document.getElementById('createOfferModal'));
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('offerStartDate').value = today;
    
    // Set end date to one day from today by default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('offerEndDate').value = tomorrow.toISOString().split('T')[0];
    
    modal.show();
}

// Create Offer
function createOffer() {
    const form = document.getElementById('createOfferForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const servicesSelect = document.getElementById('offerServices');
    const selectedServices = Array.from(servicesSelect.selectedOptions).map(option => option.value);
    
    const offer = {
        id: Date.now(),
        title: document.getElementById('offerTitle').value,
        description: document.getElementById('offerDescription').value,
        discount: parseInt(document.getElementById('offerDiscount').value),
        coupon: document.getElementById('offerCoupon').value.toUpperCase(),
        startDate: document.getElementById('offerStartDate').value,
        endDate: document.getElementById('offerEndDate').value,
        badge: document.getElementById('offerBadge').value || 'Special',
        icon: document.getElementById('offerIcon').value || 'fas fa-gift',
        terms: document.getElementById('offerTerms').value || 'Limited time offer',
        featured: document.getElementById('offerFeatured').checked,
        services: selectedServices.length > 0 ? selectedServices : ['all'],
        active: document.getElementById('offerActive').checked,
        createdAt: new Date().toISOString(),
        timesUsed: 0
    };
    
    const offers = getOffers();
    offers.push(offer);
    saveOffers(offers);
    
    // Close modal and reset form
    bootstrap.Modal.getInstance(document.getElementById('createOfferModal')).hide();
    form.reset();
    
    // Show success message
    showToast('Success!', 'Offer created successfully', 'success');
    
    // Reload offers list
    loadOffers();
    loadDashboard();
}

// Load Offers
function loadOffers() {
    const offers = getOffers();
    const now = new Date();
    
    const offersHtml = offers.map(offer => {
        const isExpired = new Date(offer.endDate) < now;
        const statusClass = isExpired ? 'expired' : (offer.active ? 'active' : '');
        const statusBadge = isExpired ? 
            '<span class="badge badge-status bg-danger">Expired</span>' : 
            (offer.active ? '<span class="badge badge-status bg-success">Active</span>' : '<span class="badge badge-status bg-secondary">Inactive</span>');
        
        return `
            <div class="offer-card ${statusClass}">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h5 class="mb-1">${offer.title}</h5>
                        <p class="mb-2 text-muted">${offer.description}</p>
                    </div>
                    ${statusBadge}
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <small class="text-muted d-block"><i class="fas fa-percent me-1"></i>Discount: <strong>${offer.discount}%</strong></small>
                        <small class="text-muted d-block"><i class="fas fa-ticket-alt me-1"></i>Coupon: <strong>${offer.coupon}</strong></small>
                        <small class="text-muted d-block"><i class="fas fa-calendar me-1"></i>Valid: ${formatDate(offer.startDate)} - ${formatDate(offer.endDate)}</small>
                        <small class="text-muted d-block"><i class="fas fa-tag me-1"></i>Badge: <strong>${offer.badge || 'N/A'}</strong></small>
                    </div>
                    <div class="col-md-6">
                        <small class="text-muted d-block"><i class="fas fa-chart-line me-1"></i>Times Used: <strong>${offer.timesUsed || 0}</strong></small>
                        <small class="text-muted d-block"><i class="fas fa-cube me-1"></i>Icon: <strong>${offer.icon || 'default'}</strong></small>
                        <small class="text-muted d-block"><i class="fas fa-star me-1"></i>Featured: <strong>${offer.featured ? 'Yes' : 'No'}</strong></small>
                        <small class="text-muted d-block"><i class="fas fa-info-circle me-1"></i>Terms: <strong>${offer.terms || 'N/A'}</strong></small>
                    </div>
                </div>
                <div class="mt-3">
                    <button class="btn btn-sm btn-outline-primary me-2" onclick="toggleOfferStatus(${offer.id})">
                        <i class="fas fa-toggle-${offer.active ? 'on' : 'off'} me-1"></i>${offer.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteOffer(${offer.id})">
                        <i class="fas fa-trash me-1"></i>Delete
                    </button>
                    <button class="btn btn-sm btn-outline-success" onclick="copyCouponCode('${offer.coupon}')">
                        <i class="fas fa-copy me-1"></i>Copy Code
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('offersList').innerHTML = offersHtml || '<p class="text-muted">No offers created yet.</p>';
}

// Load Coupons (same as offers but different view)
function loadCoupons() {
    const offers = getOffers();
    
    const couponsHtml = offers.map(offer => {
        const isExpired = new Date(offer.endDate) < new Date();
        const statusBadge = isExpired ? 
            '<span class="badge bg-danger">Expired</span>' : 
            (offer.active ? '<span class="badge bg-success">Active</span>' : '<span class="badge bg-secondary">Inactive</span>');
        
        return `
            <div class="offer-card">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h4 class="mb-1">${offer.coupon}</h4>
                        <p class="mb-1">${offer.title} - ${offer.discount}% OFF</p>
                        <small class="text-muted">Expires: ${formatDate(offer.endDate)} | Used: ${offer.timesUsed || 0} times</small>
                    </div>
                    <div class="text-end">
                        ${statusBadge}
                        <br>
                        <button class="btn btn-sm btn-outline-primary mt-2" onclick="copyWith('${offer.coupon}')">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('couponsList').innerHTML = couponsHtml || '<p class="text-muted">No coupon codes available.</p>';
}

// Show Create Coupon Modal (alias for createOffer)
function showCreateCouponModal() {
    showCreateOfferModal();
}

// Toggle offer status
function toggleOfferStatus(offerId) {
    const offers = getOffers();
    const offer = offers.find(o => o.id === offerId);
    if (offer) {
        offer.active = !offer.active;
        saveOffers(offers);
        loadOffers();
        loadDashboard();
        showToast('Updated', `Offer ${offer.active ? 'activated' : 'deactivated'}`, 'info');
    }
}

// Delete offer
function deleteOffer(offerId) {
    if (confirm('Are you sure you want to delete this offer?')) {
        let offers = getOffers();
        offers = offers.filter(o => o.id !== offerId);
        saveOffers(offers);
        loadOffers();
        loadDashboard();
        showToast('Deleted', 'Offer deleted successfully', 'warning');
    }
}

// Copy coupon code
function copyWith(code) {
    copyToClipboard(code);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied!', `Coupon code "${text}" copied to clipboard`, 'success');
    });
}

function copyCouponCode(code) {
    copyToClipboard(code);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Show toast notification
function showToast(title, message, type = 'info') {
    // Create toast element
    const toastContainer = document.createElement('div');
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '9999';
    
    const colorMap = {
        success: '#28a745',
        info: '#17a2b8',
        warning: '#ffc107',
        danger: '#dc3545'
    };
    
    toastContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert" style="min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
            <strong>${title}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    
    setTimeout(() => {
        toastContainer.remove();
    }, 3000);
}
