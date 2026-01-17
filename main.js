let products = [];
let currentCategory = "All";

async function loadProducts() {
  const res = await fetch("products.json");
  products = await res.json();
  renderProducts();
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

function renderProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  const keyword =
    document.getElementById("searchInput")?.value.toLowerCase() || "";

  products
    .filter(p =>
      (currentCategory === "All" || p.category === currentCategory) &&
      (p.name_en.toLowerCase().includes(keyword) ||
       p.name_zh.includes(keyword))
    )
    .forEach(p => {
      const img =
        p.images[p.colors[0]] ||
        p.images.default ||
        "";

      const item = document.createElement("div");
      item.className = "product";

      item.innerHTML = `
        <div class="img">
          <img src="${img}">
        </div>
        <div class="meta">
          <div class="name">${p.name_zh}</div>
          <div class="price">RM ${p.price}</div>
        </div>
      `;

      list.appendChild(item);
    });
}

loadProducts();
