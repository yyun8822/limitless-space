/* =========================
   全局状态
========================= */
let products = [];
let cart = [];
let currentCategory = "All";

/* =========================
   载入商品
========================= */
async function loadProducts() {
  try {
    const res = await fetch("products.json");
    products = await res.json();
    renderProducts();
  } catch (e) {
    console.error("Failed to load products.json", e);
  }
}

/* =========================
   汉堡菜单
========================= */
function toggleMenu() {
  const menu = document.getElementById("menu");
  if (!menu) return;
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

/* =========================
   分类
========================= */
function setCategory(cat) {
  currentCategory = cat;
  renderProducts();
  toggleMenu();
}

/* =========================
   渲染首页商品（两列）
========================= */
function renderProducts() {
  const list = document.getElementById("productList");
  if (!list) return;

  list.innerHTML = "";

  const searchInput = document.getElementById("searchInput");
  const keyword = searchInput ? searchInput.value.toLowerCase() : "";

  const filtered = products.filter(p => {
    const matchCategory =
      currentCategory === "All" || p.category === currentCategory;
    const matchSearch =
      p.name_en.toLowerCase().includes(keyword) ||
      p.name_zh.includes(keyword);
    return matchCategory && matchSearch;
  });

  filtered.forEach(p => {
    const img =
      p.images[p.colors[0]] ||
      p.images.default ||
      "";

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${img}" alt="${p.name_en}">
      <h3>${p.name_zh}</h3>
      <p>RM ${p.price}</p>
      <div class="actions">
        <button onclick="viewDetail(${p.id})">View</button>
        <button onclick="quickAdd(${p.id})">Add</button>
      </div>
    `;

    list.appendChild(card);
  });
}

/* =========================
   首页 → 详情页
========================= */
function viewDetail(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

/* =========================
   首页快速加入购物车
========================= */
function quickAdd(id) {
  const p = products.find(item => item.id === id);
  if (!p) return;

  cart.push({
    id: p.id,
    name_en: p.name_en,
    name_zh: p.name_zh,
    price: p.price,
    qty: 1
  });

  alert("Added to cart");
}

/* =========================
   启动
========================= */
loadProducts();
