let products = [];
let cart = [];
let currentLang = "en";
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
  if (!list) return;

  list.innerHTML = "";

  const searchText = document.getElementById("searchInput")
    ? document.getElementById("searchInput").value.toLowerCase()
    : "";

  const filtered = products.filter((p) => {
    const matchCategory = currentCategory === "All" ? true : p.category === currentCategory;
    const matchSearch = p.name_en.toLowerCase().includes(searchText) || p.name_zh.includes(searchText);
    return matchCategory && matchSearch;
  });

  filtered.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name_en}" />
      <div class="info">
        <h3 data-en="${p.name_en}" data-zh="${p.name_zh}">${p.name_en}</h3>
        <p data-en="RM ${p.price}" data-zh="RM ${p.price}">RM ${p.price}</p>
        <button onclick="goToDetail(${p.id})" data-en="View Details" data-zh="查看详情">View Details</button>
      </div>
    `;
    list.appendChild(card);
  });

  translate();
}

function goToDetail(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

function addToCart(product, size, color, qty = 1) {
  const exist = cart.find(
    (item) => item.id === product.id && item.size === size && item.color === color
  );

  if (exist) {
    exist.qty += qty;
  } else {
    cart.push({ ...product, size, color, qty });
  }
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (!cartItems) return;

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
      <div>
        <span data-en="${item.name_en}" data-zh="${item.name_zh}">${item.name_en}</span>
        <div class="qty">
          <button onclick="changeQty(${index}, -1)">-</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>
        <div>${item.size} / ${item.color}</div>
      </div>
      <div>
        <div>RM ${item.price * item.qty}</div>
        <button onclick="removeItem(${index})" data-en="Delete" data-zh="删除">Delete</button>
      </div>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.innerHTML = `<p data-en="Total: RM ${total}" data-zh="总计: RM ${total}">Total: RM ${total}</p>`;
  checkoutBtn.style.display = "block";

  translate();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

function checkout() {
  let message = "Order details:%0A";
  let total = 0;

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name_en} (${item.size}/${item.color}) x${item.qty} - RM ${item.price * item.qty}%0A`;
    total += item.price * item.qty;
  });

  message += `Total: RM ${total}%0A`;
  message += "Please send shipping address.";

  window.open(`https://wa.me/60173988114?text=${message}`, "_blank");
}

function changeLang(lang) {
  currentLang = lang;
  translate();
}

function translate() {
  document.querySelectorAll("[data-en]").forEach((el) => {
    const en = el.getAttribute("data-en");
    const zh = el.getAttribute("data-zh");
    el.innerText = currentLang === "zh" ? zh : en;
  });
}

loadProducts();
