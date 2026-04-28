/* ====================================================
   AURA FRAGRANCES — script.js
   ==================================================== */

'use strict';

/* ─── PRODUCT DATA STORE ─── */
const PRODUCTS = [
  {
    id: 1,
    name: 'Midnight Oud',
    price: 8500,
    image: 'https://picsum.photos/seed/midnightoud/600/800',
    notes: ['Dark wood', 'Amber', 'Vetiver'],
    description: 'A brooding, rich accord built around aged oud and smoky amber — made for those who command the night.',
    longDescription: 'Experience the essence of mystery and sophistication with Midnight Oud. This fragrance captures the soul of nocturnal luxury, blending rare Cambodian oud with aged amber and earthy vetiver. Each application tells a story of refined taste and timeless elegance. Perfect for evenings, intimate gatherings, or whenever you want to command attention with understated authority.',
    concentration: 'Eau de Parfum (14% concentration)',
    longevity: '12-18 hours',
    volume: '50ml',
    bestseller: true,
    badge: 'Bestseller'
  },
  {
    id: 2,
    name: 'Soleil Blanc',
    price: 7200,
    image: 'https://picsum.photos/seed/soleilblanc/600/800',
    notes: ['White jasmine', 'Neroli', 'Sandalwood'],
    description: 'A luminous floral that blooms like morning sunlight — delicate, warm, and endlessly refined.',
    longDescription: 'Soleil Blanc is an ode to daylight and clarity. This luminous composition opens with the sparkling top notes of Sicilian neroli, then unfolds into a magnificent heart of white jasmine and tuberose. The base of Sandalwood and musk creates a lasting, sensual trail. Ideal for daytime wear or whenever you need a touch of radiant warmth.',
    concentration: 'Eau de Parfum (12% concentration)',
    longevity: '10-14 hours',
    volume: '50ml',
    bestseller: false,
    badge: null
  },
  {
    id: 3,
    name: 'Rose Noire',
    price: 9100,
    image: 'https://picsum.photos/seed/rosenoire99/600/800',
    notes: ['Damask rose', 'Black pepper', 'Patchouli'],
    description: 'The contradiction of velvet petals and dark spice — a fragrance that refuses to be forgotten.',
    longDescription: 'Rose Noire challenges convention by pairing the romantic essence of Damask rose with sharp black pepper and mysterious patchouli. This intoxicating combination creates a sophisticated, sensual aura. The dark spice cuts through the floral sweetness, creating an unforgettable duality that shifts throughout the day.',
    concentration: 'Eau de Parfum (15% concentration)',
    longevity: '14-18 hours',
    volume: '50ml',
    bestseller: false,
    badge: 'New'
  },
  {
    id: 4,
    name: 'Forêt Sauvage',
    price: 7800,
    image: 'https://picsum.photos/seed/foretsauvage/600/800',
    notes: ['Cedarwood', 'Bergamot', 'Fougère'],
    description: 'Rain-soaked earth and raw cedar — a breath of untamed wilderness bottled with precision.',
    longDescription: 'Forêt Sauvage transports you to a misty forest after rainfall. Fresh bergamot and petrichor notes open the fragrance, giving way to a heart of fougère and green florals. Deep cedarwood and moss anchor the composition, creating a woody, earthy foundation. A truly unisex fragrance for the adventurous soul.',
    concentration: 'Eau de Parfum (13% concentration)',
    longevity: '11-16 hours',
    volume: '50ml',
    bestseller: false,
    badge: null
  }
];

/* ─── CART MANAGEMENT ─── */
class CartManager {
  constructor() {
    this.cart = this.loadCart();
  }

  loadCart() {
    const saved = localStorage.getItem('aura_cart') || sessionStorage.getItem('aura_cart');
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem('aura_cart', JSON.stringify(this.cart));
    sessionStorage.setItem('aura_cart', JSON.stringify(this.cart));
    this.notifyObservers();
  }

  addToCart(productId, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = this.cart.find(item => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.cart.push({ ...product, quantity });
    }
    this.saveCart();
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
  }

  updateQuantity(productId, quantity) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart();
      }
    }
  }

  getTotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getItemCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  observers = [];

  subscribe(callback) {
    this.observers.push(callback);
  }

  notifyObservers() {
    this.observers.forEach(callback => callback());
  }
}

const cartManager = new CartManager();

/* ─── DOM References ─── */
const cursor       = document.getElementById('cursor');
const cursorFollow = document.getElementById('cursor-follower');
const nav          = document.getElementById('nav');
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobile-menu');

/* ─────────────────────────────────────────
   1. CUSTOM CURSOR
───────────────────────────────────────── */
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;
let cursorVisible = false;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (!cursorVisible) {
    cursor.style.opacity = '1';
    cursorFollow.style.opacity = '0.6';
    cursorVisible = true;
  }

  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

/* Smooth follower via rAF */
function animateCursor() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;

  cursorFollow.style.left = followerX + 'px';
  cursorFollow.style.top  = followerY + 'px';

  requestAnimationFrame(animateCursor);
}
animateCursor();

/* Cursor size on interactive elements */
const interactives = document.querySelectorAll('a, button, .product-card, .feature-item');

interactives.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform       = 'translate(-50%, -50%) scale(2)';
    cursor.style.background      = 'transparent';
    cursor.style.border          = '1px solid var(--gold)';
    cursorFollow.style.width     = '56px';
    cursorFollow.style.height    = '56px';
    cursorFollow.style.opacity   = '0.35';
  });

  el.addEventListener('mouseleave', () => {
    cursor.style.transform       = 'translate(-50%, -50%) scale(1)';
    cursor.style.background      = 'var(--gold)';
    cursor.style.border          = 'none';
    cursorFollow.style.width     = '36px';
    cursorFollow.style.height    = '36px';
    cursorFollow.style.opacity   = '0.6';
  });
});

/* ─────────────────────────────────────────
   2. NAVIGATION — Scroll Behavior
───────────────────────────────────────── */
let lastScrollY = window.scrollY;

function handleNavScroll() {
  const scrollY = window.scrollY;

  /* Add scrolled class for glass blur effect */
  if (scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  lastScrollY = scrollY;
}

window.addEventListener('scroll', handleNavScroll, { passive: true });

/* ─────────────────────────────────────────
   3. MOBILE MENU
───────────────────────────────────────── */
hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* Close mobile menu on link click */
document.querySelectorAll('.mobile-menu__link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─────────────────────────────────────────
   4. INTERSECTION OBSERVER — Scroll Reveals
───────────────────────────────────────── */
const animatedElements = document.querySelectorAll(
  '.fade-in-up, .fade-in-left, .fade-in-right'
);

const observerOptions = {
  root: null,
  rootMargin: '0px 0px -80px 0px',
  threshold: 0.12,
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    const el    = entry.target;
    const delay = parseFloat(el.dataset.delay || 0);

    setTimeout(() => {
      el.classList.add('visible');
    }, delay);

    revealObserver.unobserve(el);
  });
}, observerOptions);

animatedElements.forEach(el => revealObserver.observe(el));

/* ─────────────────────────────────────────
   5. HERO REVEAL — Staggered on Load
───────────────────────────────────────── */
document.querySelectorAll('.reveal-up').forEach(el => {
  const delay = parseFloat(el.dataset.delay || 0);
  el.style.animationDelay = delay + 'ms';
});

/* ─────────────────────────────────────────
   6. SMOOTH SCROLL — Nav Links
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '') return; // Skip empty links
    
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const navHeight  = nav.getBoundingClientRect().height;
    const targetTop  = target.getBoundingClientRect().top + window.scrollY;
    const scrollTo   = targetTop - navHeight;

    window.scrollTo({ top: scrollTo, behavior: 'smooth' });
  });
});

/* ─────────────────────────────────────────
   7. PRODUCT CARD — Tilt Effect & Interactions
───────────────────────────────────────── */
function initTiltEffect() {
  if (window.innerWidth < 768) return;

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect     = card.getBoundingClientRect();
      const cx       = rect.left + rect.width / 2;
      const cy       = rect.top  + rect.height / 2;
      const dx       = (e.clientX - cx) / (rect.width  / 2);
      const dy       = (e.clientY - cy) / (rect.height / 2);
      const tiltX    = dy * -5;
      const tiltY    = dx *  5;

      card.style.transform = `translateY(-6px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.transition = 'transform 0.05s linear';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
  });
}

/* ─────────────────────────────────────────
   7B. PRODUCT INTERACTIONS
───────────────────────────────────────── */
function initProductInteractions() {
  /* View Details */
  document.querySelectorAll('.product-card .btn--outline').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-card');
      if (!card) return;
      const productName = card.querySelector('.product-card__name').textContent;
      const product = PRODUCTS.find(p => p.name === productName);
      if (product) {
        showProductDetail(product);
      }
    });
  });

  /* Add to Cart */
  document.querySelectorAll('.product-card .btn--small.btn--gold').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-card');
      if (!card) return;
      const productName = card.querySelector('.product-card__name').textContent;
      const product = PRODUCTS.find(p => p.name === productName);
      if (product) {
        cartManager.addToCart(product.id, 1);
        showCartNotification(product.name);
        updateCartBadge();
      }
    });
  });
}

initTiltEffect();

/* ─────────────────────────────────────────
   8. SCROLL PROGRESS LINE (thin gold top bar)
───────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  width: 0%;
  background: linear-gradient(90deg, #c4a052, #e8d4a0);
  z-index: 9999;
  pointer-events: none;
  transition: width 0.1s linear;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop  = window.scrollY;
  const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
  const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}, { passive: true });

/* ─────────────────────────────────────────
   9. PARALLAX — Hero Background
───────────────────────────────────────── */
const heroImg = document.querySelector('.hero__img');

if (heroImg && window.innerWidth > 768) {
  window.addEventListener('scroll', () => {
    const scrollY   = window.scrollY;
    const heroHeight = document.querySelector('.hero').offsetHeight;

    if (scrollY < heroHeight) {
      const offset = scrollY * 0.35;
      heroImg.style.transform = `scale(1.07) translateY(${offset}px)`;
    }
  }, { passive: true });
}

/* ─────────────────────────────────────────
   10. RESIZE HANDLER
───────────────────────────────────────── */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initTiltEffect();
  }, 250);
});

/* ─────────────────────────────────────────
   11. INIT LOG
───────────────────────────────────────── */
console.log('%cAURA FRAGRANCES', 'font-size:24px; font-family:serif; color:#c4a052; letter-spacing:8px;');
console.log('%cCrafted Scents. Timeless Identity.', 'font-size:11px; color:#8a8070; letter-spacing:3px;');

/* ─────────────────────────────────────────
   12. PRODUCT DETAIL MODAL
───────────────────────────────────────── */
function createProductDetailModal(product) {
  const modal = document.createElement('div');
  modal.className = 'product-detail-modal';
  modal.innerHTML = `
    <div class="product-detail-modal__overlay"></div>
    <div class="product-detail-modal__content">
      <button class="product-detail-modal__close">&times;</button>
      
      <div class="product-detail-modal__grid">
        <div class="product-detail-modal__image">
          <img src="${product.image}" alt="${product.name}" />
        </div>
        
        <div class="product-detail-modal__info">
          <span class="product-detail-modal__badge">${product.badge || ''}</span>
          <h2 class="product-detail-modal__name">${product.name}</h2>
          <p class="product-detail-modal__notes">${product.notes.join(' · ')}</p>
          
          <div class="product-detail-modal__price">₹ ${product.price.toLocaleString('en-IN')} / ${product.volume}</div>
          
          <p class="product-detail-modal__description">${product.longDescription}</p>
          
          <div class="product-detail-modal__specs">
            <div class="spec">
              <strong>Concentration:</strong>
              <span>${product.concentration}</span>
            </div>
            <div class="spec">
              <strong>Longevity:</strong>
              <span>${product.longevity}</span>
            </div>
            <div class="spec">
              <strong>Volume:</strong>
              <span>${product.volume}</span>
            </div>
          </div>
          
          <div class="product-detail-modal__quantity">
            <label>Quantity:</label>
            <div class="quantity-selector">
              <button class="qty-btn qty-minus">−</button>
              <input type="number" class="qty-input" value="1" min="1" max="10" />
              <button class="qty-btn qty-plus">+</button>
            </div>
          </div>
          
          <div class="product-detail-modal__actions">
            <button class="btn btn--gold btn--add-to-cart">Add to Cart</button>
            <a href="cart.html" class="btn btn--outline">View Cart</a>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return modal;
}

function showProductDetail(product) {
  const modal = createProductDetailModal(product);
  document.body.appendChild(modal);
  
  setTimeout(() => modal.classList.add('active'), 10);
  
  const closeBtn = modal.querySelector('.product-detail-modal__close');
  const overlay = modal.querySelector('.product-detail-modal__overlay');
  const addBtn = modal.querySelector('.btn--add-to-cart');
  const qtyMinus = modal.querySelector('.qty-minus');
  const qtyPlus = modal.querySelector('.qty-plus');
  const qtyInput = modal.querySelector('.qty-input');
  
  const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  };
  
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  
  qtyMinus.addEventListener('click', () => {
    let val = parseInt(qtyInput.value) - 1;
    if (val < 1) val = 1;
    qtyInput.value = val;
  });
  
  qtyPlus.addEventListener('click', () => {
    let val = parseInt(qtyInput.value) + 1;
    if (val > 10) val = 10;
    qtyInput.value = val;
  });
  
  addBtn.addEventListener('click', () => {
    const qty = parseInt(qtyInput.value) || 1;
    cartManager.addToCart(product.id, qty);
    showCartNotification(product.name, qty);
    updateCartBadge();
    closeModal();
  });
  
  document.body.style.overflow = 'hidden';
  closeBtn.addEventListener('click', () => {
    document.body.style.overflow = '';
  });
  overlay.addEventListener('click', () => {
    document.body.style.overflow = '';
  });
}

/* ─────────────────────────────────────────
   13. CART NOTIFICATION
───────────────────────────────────────── */
function showCartNotification(productName, quantity = 1) {
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${quantity}x <strong>${productName}</strong> added to cart</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('visible'), 10);
  
  setTimeout(() => {
    notification.classList.remove('visible');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

/* ─────────────────────────────────────────
   14. CART BADGE UPDATE
───────────────────────────────────────── */
function updateCartBadge() {
  const badges = document.querySelectorAll('[data-cart-count]');
  const count = cartManager.getItemCount();

  badges.forEach(badge => {
    if (count === 0) {
      badge.textContent = '';
      badge.hidden = true;
      return;
    }

    badge.textContent = count;
    badge.hidden = false;
  });
}

/* ─────────────────────────────────────────
   15. INIT ALL INTERACTIONS
───────────────────────────────────────── */
function initAllInteractions() {
  initTiltEffect();
  initProductInteractions();
  updateCartBadge();
}

/* Initialize on load */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAllInteractions);
} else {
  initAllInteractions();
}
