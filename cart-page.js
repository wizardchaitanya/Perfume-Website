/* ====================================================
   AURA FRAGRANCES — cart-page.js
   Cart Page Functionality
   ==================================================== */

'use strict';

const TAX_RATE = 0.18; // 18% GST
const SHIPPING_THRESHOLD = 5000; // Free shipping over 5000
const SHIPPING_COST = 200;

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

/* ─── CART PAGE FUNCTIONALITY ─── */
class CartPageManager {
  constructor() {
    this.cartManager = cartManager;
    this.init();
  }

  init() {
    this.renderCart();
    this.attachEventListeners();
    this.cartManager.subscribe(() => this.renderCart());
  }

  renderCart() {
    const cartItems = this.cartManager.cart;
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');

    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <p>Your cart is empty</p>
          <a href="index.html#products" class="btn btn--gold">Continue Shopping</a>
        </div>
      `;
      this.updateSummary(0, 0, 0);
      return;
    }

    cartEmpty?.remove();

    cartItemsContainer.innerHTML = cartItems
      .map((item, index) => this.createCartItemHTML(item, index))
      .join('');

    this.attachItemEventListeners();
    this.updateSummary(this.cartManager.getTotal(), cartItems);
  }

  createCartItemHTML(item, index) {
    const itemTotal = item.price * item.quantity;
    return `
      <div class="cart-item" data-product-id="${item.id}">
        <div class="cart-item__image">
          <img src="${item.image}" alt="${item.name}" />
        </div>

        <div class="cart-item__details">
          <h3 class="cart-item__name">${item.name}</h3>
          <p class="cart-item__notes">${item.notes.join(' · ')}</p>
          <p class="cart-item__sku">SKU: ${String(item.id).padStart(4, '0')}</p>
        </div>

        <div class="cart-item__quantity">
          <button class="qty-btn qty-decrease" data-id="${item.id}">−</button>
          <input type="number" class="qty-input" value="${item.quantity}" min="1" max="10" data-id="${item.id}" />
          <button class="qty-btn qty-increase" data-id="${item.id}">+</button>
        </div>

        <div class="cart-item__price">
          <p class="cart-item__unit-price">₹ ${item.price.toLocaleString('en-IN')}</p>
          <p class="cart-item__total">₹ ${itemTotal.toLocaleString('en-IN')}</p>
        </div>

        <button class="cart-item__remove" data-id="${item.id}" aria-label="Remove item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    `;
  }

  attachItemEventListeners() {
    /* Quantity buttons */
    document.querySelectorAll('.qty-decrease').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(btn.dataset.id);
        const input = document.querySelector(`.qty-input[data-id="${productId}"]`);
        let qty = parseInt(input.value) - 1;
        if (qty < 1) qty = 1;
        this.cartManager.updateQuantity(productId, qty);
      });
    });

    document.querySelectorAll('.qty-increase').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(btn.dataset.id);
        const input = document.querySelector(`.qty-input[data-id="${productId}"]`);
        let qty = parseInt(input.value) + 1;
        if (qty > 10) qty = 10;
        this.cartManager.updateQuantity(productId, qty);
      });
    });

    document.querySelectorAll('.qty-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const productId = parseInt(input.dataset.id);
        let qty = parseInt(input.value) || 1;
        if (qty < 1) qty = 1;
        if (qty > 10) qty = 10;
        this.cartManager.updateQuantity(productId, qty);
      });
    });

    /* Remove buttons */
    document.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = parseInt(btn.dataset.id);
        this.cartManager.removeFromCart(productId);
        showRemovalNotification();
      });
    });
  }

  updateSummary(subtotal, cartItems) {
    const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shippingCost + tax;

    document.getElementById('subtotal').textContent = `₹ ${subtotal.toLocaleString('en-IN')}`;
    document.getElementById('shipping').textContent = shippingCost === 0 ? 'FREE' : `₹ ${shippingCost.toLocaleString('en-IN')}`;
    document.getElementById('tax').textContent = `₹ ${Math.round(tax).toLocaleString('en-IN')}`;
    document.getElementById('total').textContent = `₹ ${Math.round(total).toLocaleString('en-IN')}`;

    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.disabled = this.cartManager.cart.length === 0;
  }

  attachEventListeners() {
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', () => this.handleCheckout());
  }

  handleCheckout() {
    if (this.cartManager.cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    const total = document.getElementById('total').textContent;
    alert(`Proceeding to checkout with total: ${total}\n\nThis is a demo. In a real application, this would redirect to a payment gateway.`);
    
    // In a real app, redirect to payment gateway
    // window.location.href = '/checkout';
  }
}

/* ─── NOTIFICATIONS ─── */
function showRemovalNotification() {
  const notification = document.createElement('div');
  notification.className = 'cart-notification removal';
  notification.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M6 7l1-2h8l1 2"/>
    </svg>
    <span>Item removed from cart</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => notification.classList.add('visible'), 10);
  
  setTimeout(() => {
    notification.classList.remove('visible');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

/* ─── MOBILE MENU FUNCTIONALITY ─── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ─── NAV SCROLL BEHAVIOR ─── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

/* ─── CUSTOM CURSOR ─── */
const cursor = document.getElementById('cursor');
const cursorFollow = document.getElementById('cursor-follower');

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
  cursor.style.top = mouseY + 'px';
});

function animateCursor() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  cursorFollow.style.left = followerX + 'px';
  cursorFollow.style.top = followerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ─── SCROLL PROGRESS BAR ─── */
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
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}, { passive: true });

/* ─── INIT ─── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CartPageManager();
  });
} else {
  new CartPageManager();
}

console.log('%cAURA FRAGRANCES — CART', 'font-size:18px; font-family:serif; color:#c4a052; letter-spacing:6px;');
