let products = [];
let cart = [];
let currentCategory = "All";
let currentLang = "en";

async function loadProducts() {
  const response = await fetch("products.json");
  products = await response.json();
  loadCartFromStorage();
  renderProducts();
  renderCart();
}

function loadCartFromStorage() {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCartToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("show");
}

function setCategory(cat) {
  currentCategory = cat;
  renderProducts();
  toggleMenu();
}

function applyFilter() {
  renderProducts();
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

    card.onclick = () => {
      localStorage.setItem("currentProduct", JSON.stringify(p));
      window.location.href = "detail.html";
    };

    card.innerHTML = `
      <img src="${p.images[p.colors[0]] || p.images.default}" alt="${p.name_en}" />
      <div class="info">
        <h3 data-en="${p.name_en}" data-zh="${p.name_zh}">${p.name_zh}</h3>
        <p data-en="RM ${p.price}" data-zh="RM ${p.price}">RM ${p.price}</p>
        <button class="add-btn" onclick="quickAdd(event, ${p.id})" data-en="Add to Cart" data-zh="加入购物车">
          Add to Cart
        </button>
      </div>
    `;
    list.appendChild(card);
  });

  translate();
}

function quickAdd(e, id) {
  e.stopPropagation();
  const p = products.find(x => x.id === id);
  if (!p) return;

  cart.push({
    id: p.id,
    name_en: p.name_en,
    name_zh: p.name_zh,
    price: p.price,
    color: p.colors[0],
    size: p.sizes[0],
    qty: 1
  });

  saveCartToStorage();
  renderCart();
}

function translate() {
  document.querySelectorAll("[data-en]").forEach((el) => {
    const en = el.getAttribute("data-en");
    const zh = el.getAttribute("data-zh");
    el.innerText = currentLang === "zh" ? zh : en;
  });
}

function changeLang(lang) {
  currentLang = lang;
  translate();
}

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
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <span data-en="${item.name_en}" data-zh="${item.name_zh}">${item.name_zh}</span>
      <span>RM ${item.price} x ${item.qty}</span>
      <span>
        <button onclick="changeQty(${index}, -1)">-</button>
        <button onclick="changeQty(${index}, 1)">+</button>
        <button onclick="removeItem(${index})">Delete</button>
      </span>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.innerHTML = `<p data-en="Total: RM ${total}" data-zh="总计: RM ${total}">Total: RM ${total}</p>`;
  checkoutBtn.style.display = "block";

  translate();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart[index].qty = 1;
  saveCartToStorage();
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCartToStorage();
  renderCart();
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

loadProducts();
