let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "All";

async function loadProducts() {
  const response = await fetch("products.json");
  products = await response.json();
  renderProducts();
  renderCart();
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function renderProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  const searchText = document.getElementById("searchInput").value.toLowerCase();

  const filtered = products.filter((p) => {
    const matchCategory = currentCategory === "All" ? true : p.category === currentCategory;
    const matchSearch = p.name_en.toLowerCase().includes(searchText) || p.name_zh.includes(searchText);
    return matchCategory && matchSearch;
  });

  filtered.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${p.images.default}" alt="${p.name_en}" />
      <div class="info">
        <h3>${p.name_en}</h3>
        <p>RM ${p.price}</p>
        <button onclick="viewDetail(${p.id})">View Detail</button>
        <button onclick="addToCartHome(${p.id})">Add to Cart</button>
      </div>
    `;

    list.appendChild(card);
  });
}

function viewDetail(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

function setCategory(cat) {
  currentCategory = cat;

  document.querySelectorAll(".menu button").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.innerText === (cat === "All" ? "All" : "T-Shirts")) {
      btn.classList.add("active");
    }
  });

  renderProducts();
}

function addToCartHome(id) {
  const product = products.find(p => p.id === id);
  cart.push({
    id: product.id,
    name_en: product.name_en,
    price: product.price,
    color: product.colors[0],
    size: product.sizes[0],
    qty: 1
  });
  saveCart();
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const cartCount = document.getElementById("cartCount");

  cartItems.innerHTML = "";
  cartCount.innerText = cart.length;

  if (cart.length === 0) {
    cartItems.innerHTML = `<p>Cart is empty</p>`;
    cartTotal.innerHTML = "";
    checkoutBtn.style.display = "none";
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div>
        <div>${item.name_en}</div>
        <div>RM ${item.price} x ${item.qty}</div>
      </div>
      <div>
        <button onclick="changeQty(${index}, -1)">-</button>
        <button onclick="changeQty(${index}, 1)">+</button>
        <button onclick="removeItem(${index})">Delete</button>
      </div>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.innerHTML = `<div>Total: RM ${total}</div>`;
  checkoutBtn.style.display = "block";
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart[index].qty = 1;
  saveCart();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function toggleCart() {
  const cart = document.getElementById("cart");
  cart.classList.toggle("open");
}

function checkout() {
  let message = "Order details:%0A";
  let total = 0;

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name_en} (${item.color}/${item.size}) - RM ${item.price} x ${item.qty}%0A`;
    total += item.price * item.qty;
  });

  message += `Total: RM ${total}%0A`;
  message += "Please send me the shipping address.";

  window.open(`https://wa.me/60173988114?text=${message}`, "_blank");
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

loadProducts();
