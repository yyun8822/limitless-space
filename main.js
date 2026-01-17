let products = [];
let cart = [];
let currentCategory = "All";

function loadProducts() {
  fetch("products.json")
    .then(res => res.json())
    .then(data => {
      products = data;
      loadCart();
      renderProducts();
    });
}

function toggleMenu() {
  document.getElementById("menu").classList.toggle("show");
}

function setCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll(".cat-btn").forEach(btn => {
    btn.classList.toggle("active", btn.innerText === cat);
  });
  renderProducts();
}

function renderProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  const searchText = document.getElementById("searchInput").value.toLowerCase();

  const filtered = products.filter(p => {
    const matchCat = currentCategory === "All" ? true : p.category === currentCategory;
    const matchSearch =
      p.name_en.toLowerCase().includes(searchText) ||
      p.name_zh.includes(searchText);
    return matchCat && matchSearch;
  });

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${p.images[p.colors[0]]}" alt="${p.name_en}">
      <div class="info">
        <h3>${p.name_en}</h3>
        <p>RM ${p.price}</p>
        <div class="btn-row">
          <button class="view-btn" onclick="viewDetail(${p.id})">View Detail</button>
          <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    `;
    list.appendChild(card);
  });

  updateCartCount();
}

function viewDetail(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const item = cart.find(c => c.id === id && c.color === product.colors[0]);

  if (item) item.qty++;
  else cart.push({
    id,
    name_en: product.name_en,
    price: product.price,
    color: product.colors[0],
    qty: 1
  });

  saveCart();
  renderCart();
  updateCartCount();
  showToast();
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("show");
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Cart is empty</p>";
    cartTotal.innerHTML = "";
    checkoutBtn.style.display = "none";
    return;
  }

  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div>
        <div>${item.name_en}</div>
        <div>${item.color}</div>
      </div>
      <div>
        <div>RM ${item.price} x ${item.qty}</div>
        <div>
          <button onclick="changeQty(${idx}, -1)">-</button>
          <button onclick="changeQty(${idx}, 1)">+</button>
          <button onclick="removeItem(${idx})">Delete</button>
        </div>
      </div>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.innerHTML = `<p>Total: RM ${total}</p>`;
  checkoutBtn.style.display = "block";
}

function changeQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart[idx].qty = 1;
  saveCart();
  renderCart();
  updateCartCount();
}

function removeItem(idx) {
  cart.splice(idx, 1);
  saveCart();
  renderCart();
  updateCartCount();
}

function checkout() {
  let msg = "Order details:%0A";
  let total = 0;
  cart.forEach((item, i) => {
    msg += `${i+1}. ${item.name_en} (${item.color}) x ${item.qty} - RM ${item.price}%0A`;
    total += item.price * item.qty;
  });
  msg += `Total: RM ${total}%0A`;
  window.open(`https://wa.me/60173988114?text=${msg}`, "_blank");
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const stored = localStorage.getItem("cart");
  if (stored) cart = JSON.parse(stored);
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").innerText = count;
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 800);
}

loadProducts();
