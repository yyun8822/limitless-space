let products = [];
let cart = [];
let currentLang = "en";
let currentCategory = "All";

// Load products from products.json
async function loadProducts() {
  const response = await fetch("products.json");
  products = await response.json();
  renderProducts();
  renderCart();
}

// Toggle menu
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

// Render products
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
      ${p.tag ? `<div class="tag" data-en="${p.tag}" data-zh="${p.tag}">${p.tag}</div>` : ""}
      <img src="${p.image}" alt="${p.name_en}" />
      <div class="info">
        <h3 data-en="${p.name_en}" data-zh="${p.name_zh}">${p.name_en}</h3>
        <p data-en="Price: RM ${p.price}" data-zh="价格: RM ${p.price}">
          Price: RM ${p.price}
        </p>
        <button onclick="addToCart(${p.id})" data-en="Add to Cart" data-zh="加入购物车">
          Add to Cart
        </button>
      </div>
    `;

    list.appendChild(card);
  });

  translate();
}

// Add to cart
function addToCart(id) {
  const product = products.find((p) => p.id === id);
  cart.push(product);
  renderCart();
}

// Render cart
function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<p data-en="Cart is empty" data-zh="购物车为空">Cart is empty</p>`;
    cartTotal.innerHTML = "";
    checkoutBtn.style.display = "none";
    translate();
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <span data-en="${item.name_en}" data-zh="${item.name_zh}">${item.name_en}</span>
      <span>RM ${item.price}</span>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.innerHTML = `<p data-en="Total: RM ${total}" data-zh="总计: RM ${total}">Total: RM ${total}</p>`;
  checkoutBtn.style.display = "block";

  translate();
}

// Checkout
function checkout() {
  let message = "Order details:%0A";
  let total = 0;

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name_en} - RM ${item.price}%0A`;
    total += item.price;
  });

  message += `Total: RM ${total}%0A`;
  message += "Please send me the shipping address and size.";

  window.open(`https://wa.me/60173988114?text=${message}`, "_blank");
}

// Change language
function changeLang(lang) {
  currentLang = lang;
  translate();
}

// Set category
function setCategory(cat) {
  currentCategory = cat;

  document.querySelectorAll(".menu button").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.innerText === cat || (cat === "All" && btn.innerText === "All")) {
      btn.classList.add("active");
    }
  });

  renderProducts();
}

// Search filter
function applyFilter() {
  renderProducts();
}

// Translate text
function translate() {
  document.querySelectorAll("[data-en]").forEach((el) => {
    const en = el.getAttribute("data-en");
    const zh = el.getAttribute("data-zh");
    el.innerText = currentLang === "zh" ? zh : en;
  });
}

loadProducts();
