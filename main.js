let products = [];
let cart = [];
let currentCategory = "All";

const colorMap = {
  Black: "#000",
  White: "#fff",
  Grey: "#aaa",
  Gray: "#aaa",
  Green: "#4f7f52"
};

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

  const search = document.getElementById("searchInput").value.toLowerCase();

  products
    .filter(p =>
      (currentCategory === "All" || p.category === currentCategory) &&
      p.name_en.toLowerCase().includes(search)
    )
    .forEach(p => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${p.images[p.colors[0]]}">
        <div class="info">
          <div class="color-row">
            ${p.colors.map(c => `
              <span class="color-dot" style="background:${colorMap[c] || "#ccc"}"></span>
            `).join("")}
          </div>
          <h3>${p.name_en}</h3>
          <p>RM ${p.price}</p>
          <button class="view-btn" onclick="viewDetail(${p.id})">View Detail</button>
        </div>
      `;
      list.appendChild(card);
    });

  updateCartCount();
}

function viewDetail(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

/* Cart */
function toggleCart() {
  document.getElementById("cart").classList.toggle("show");
  renderCart();
}

function renderCart() {
  const items = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  items.innerHTML = "";

  let total = 0;
  cart.forEach((item, i) => {
    total += item.price * item.qty;
    items.innerHTML += `
      <div class="item">
        <span>${item.name_en}</span>
        <span>
          <button onclick="changeQty(${i},-1)">-</button>
          ${item.qty}
          <button onclick="changeQty(${i},1)">+</button>
        </span>
      </div>
    `;
  });

  totalEl.innerText = `Total: RM ${total}`;
}

function changeQty(i, d) {
  cart[i].qty += d;
  if (cart[i].qty < 1) cart[i].qty = 1;
  saveCart();
  renderCart();
  updateCartCount();
}

function checkout() {
  let msg = "Order:%0A";
  cart.forEach(c => {
    msg += `${c.name_en} x ${c.qty}%0A`;
  });
  window.open(`https://wa.me/60173988114?text=${msg}`);
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const stored = localStorage.getItem("cart");
  if (stored) cart = JSON.parse(stored);
}

function updateCartCount() {
  document.getElementById("cartCount").innerText =
    cart.reduce((s, i) => s + i.qty, 0);
}

loadProducts();
