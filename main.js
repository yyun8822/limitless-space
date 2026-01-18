let products = [];
let cart = [];
let currentCategory = "All";

fetch("products.json")
  .then(res => res.json())
  .then(data => {
    products = data;
    cart = JSON.parse(localStorage.getItem("cart")) || [];
    renderProducts();
    updateCartCount();
  });

function openMenu() {
  menu.classList.add("show");
  overlay.classList.add("show");
}

function closeMenu() {
  menu.classList.remove("show");
  overlay.classList.remove("show");
}

function setCategory(cat) {
  currentCategory = cat;
  renderProducts();
}

function renderProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products
    .filter(p => currentCategory === "All" || p.category === currentCategory)
    .forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.onclick = () => location.href = `product-detail.html?id=${p.id}`;

      card.innerHTML = `
        <img id="img-${p.id}" src="${p.images[p.colors[0]]}">
        <h3>${p.name_en}</h3>
        <p>RM ${p.price}</p>
        <div class="color-row">
          ${p.colors.map(c => `
            <div class="color-dot"
              style="background:${c}"
              onclick="event.stopPropagation();switchImg(${p.id},'${c}')">
            </div>`).join("")}
        </div>
      `;
      list.appendChild(card);
    });
}

function switchImg(id, color) {
  const p = products.find(x => x.id === id);
  document.getElementById(`img-${id}`).src = p.images[color];
}

function updateCartCount() {
  document.getElementById("cartCount").innerText =
    cart.reduce((s,i)=>s+i.qty,0);
}
