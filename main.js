let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "All";

async function loadProducts() {
  const response = await fetch("products.json");
  products = await response.json();
  renderProducts();
  updateCartCount();
}

function toggleMenu() {
  document.getElementById("menu").classList.toggle("open");
}

function setCategory(cat) {
  currentCategory = cat;
  renderProducts();
}

function renderProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  const searchText = document.getElementById("searchInput").value.toLowerCase();

  const filtered = products.filter(p => {
    const matchCategory = currentCategory === "All" ? true : p.category === currentCategory;
    const matchSearch = p.name_en.toLowerCase().includes(searchText) || p.name_zh.includes(searchText);
    return matchCategory && matchSearch;
  });

  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${p.images[p.colors[0]]}" alt="${p.name_en}" />
      <div class="info">
        <h3>${p.name_en}</h3>
        <p>RM ${p.price}</p>
        <button onclick="viewDetail(${p.id})">View Details</button>
      </div>
    `;

    list.appendChild(card);
  });
}

function viewDetail(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  cart.push({
    id: product.id,
    name_en: product.name_en,
    price: product.price,
    qty: 1
  });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  document.getElementById("cartCount").innerText = cart.length;
}

function toggleCart() {
  document.getElementById("cartModal").classList.toggle("open");
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <span>${item.name_en}</span>
      <span>RM ${item.price} x ${item.qty}</span>
      <span>
        <button onclick="changeQty(${index}, -1)">-</button>
        <button onclick="changeQty(${index}, 1)">+</button>
        <button onclick="removeItem(${index})">Delete</button>
      </span>
    `;
    cartItems.appendChild(div);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById("cartTotal").innerText = `Total: RM ${total}`;
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty < 1) cart[index].qty = 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function checkout() {
  alert("Checkout feature not implemented yet");
}

loadProducts();
