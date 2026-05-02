const products = [
  { id: 1, name: 'ماتشا لاتيه بارد', desc: 'ماتشا ياباني مع حليب كريمي وثلج منعش', price: 18, image: 'https://i.pinimg.com/1200x/45/9a/fb/459afbc3f9000c8001ab06e67549b924.jpg', cat: 'cold', badge: 'الأكثر طلباً', badgeClass: '' },
  { id: 2, name: 'ماتشا لاتيه ساخن', desc: 'الكلاسيك الأصيل: ماتشا مع حليب طازج ساخن', price: 16, image: 'https://i.pinimg.com/736x/bd/16/8f/bd168f379e414ea3da03908664851904.jpg', cat: 'hot', badge: '', badgeClass: '' },
  { id: 3, name: 'ماتشا فرابيه', desc: 'مثلج ومخفوق مع كريمة وشراب الماتشا', price: 22, image: 'https://imgs.search.brave.com/o21FPNUnsNzYGTqGfJGCFxTA06ddR3ZaEQm-wgxMuWI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9wbmcu/cG5ndHJlZS5jb20v/dGh1bWJfYmFjay9m/aDI2MC9iYWNrZ3Jv/dW5kLzIwMjQxMDEx/L3BuZ3RyZWUtaWNl/ZC1ncmVlbi1zbW9v/dGhpZS1mcmFwcGUt/d2l0aC1tYXRjaGEt/YW5kLWNyZWFteS13/aGlwcGVkLXRvcHBp/bmctcmVmcmVzaGlu/Zy1pbWFnZV8xNjM1/MTk1NC5qcGc', cat: 'cold', badge: 'جديد', badgeClass: 'green' },
  { id: 4, name: 'ماتشا براون شوجر', desc: 'ماتشا مع سكر البني الكراميلي الغني', price: 20, image: 'https://i.pinimg.com/736x/16/73/c2/1673c26d12e4615db587e7bfbae51c4c.jpg', cat: 'special', badge: 'مميز', badgeClass: '' },
  { id: 5, name: 'ماتشا أيس كريم لاتيه', desc: 'ماتشا بارد مع كرة أيس كريم فانيليا', price: 24, image: 'https://i.pinimg.com/736x/39/22/2c/39222cae47d07268215fd1751a0b6c6c.jpg', cat: 'special', badge: 'الأفضل', badgeClass: '' },
  { id: 6, name: 'ماتشا الكلاسيكي', desc: 'مسحوق ماتشا نقي مخفوق بالتقليدي الياباني', price: 14, image: 'https://i.pinimg.com/736x/2a/b8/3d/2ab83d4fb61922294b90c8b6ec8db915.jpg', cat: 'hot', badge: '', badgeClass: '' },
];

let cart = [];

/* ======= RENDER PRODUCTS ======= */
function renderProducts(filter = 'all') {
  const grid = document.getElementById('products-grid');
  const filtered = filter === 'all' ? products : products.filter(p => p.cat === filter);

  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      ${p.badge ? `<div class="product-badge ${p.badgeClass}">${p.badge}</div>` : ''}
      <div class="product-img"><img src="${p.image}" alt="${p.name}" style="width: 100%; height: 100%; object-fit: cover;"></div>
      <div class="product-info">
        <div class="stars">★★★★★</div>
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="product-footer">
          <div class="price">${p.price} <span>ر.س</span></div>
          <button class="add-btn" onclick="addToCart(${p.id})">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ======= FILTER MENU ======= */
function filterMenu(cat, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

/* ======= CART ======= */
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCart();
  showToast(`<img src="${product.image}" style="width: 20px; height: 20px; border-radius: 50%; vertical-align: middle; margin-left: 5px;"> تمت إضافة "${product.name}" للسلة!`);
}

function updateCart() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-total').textContent = `${total} ر.س`;

  const itemsEl = document.getElementById('cart-items');

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="empty-cart">
        <div class="icon">🛒</div>
        <p>سلتك فارغة<br>أضف منتجاً من القائمة</p>
      </div>`;
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-emoji"><img src="${item.image}" alt="${item.name}" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover;"></div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${item.price * item.qty} ر.س</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `).join('');
  }
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  updateCart();
}

function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
}

function checkout() {
  if (cart.length === 0) {
    showToast('🛒 أضف منتجاً أولاً!');
    return;
  }
  cart = [];
  updateCart();
  closeCart();
  showToast('🎉 تم استلام طلبك! سنتواصل معك قريباً');
}

/* ======= ORDER FORM ======= */
function submitOrder() {
  showToast('🍵 تم إرسال طلبك! سنتواصل معك خلال دقائق 💚');
}

/* ======= TOAST ======= */
function showToast(msg) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').innerHTML = msg; 
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ======= INIT ======= */
renderProducts();
/* ======= THEME TOGGLE ======= */
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById('theme-toggle');
  
  body.classList.toggle('dark-mode');
  
  if (body.classList.contains('dark-mode')) {
    btn.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  } else {
    btn.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }
}

// التأكد من تطبيق الثيم المفضل عند فتح الصفحة
window.onload = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.getElementById('theme-toggle').textContent = '☀️';
  }
  renderProducts(); // تشغيل دالة عرض المنتجات الأصلية
};