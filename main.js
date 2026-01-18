let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentCategory = "All";

fetch("products.json")
  .then(r => r.json())
  .then(d => {
    products = d;
    renderProducts();
    updateCart();
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
  closeMenu();
  renderProducts();
}

function renderProducts() {
  productList.innerHTML = "";
  const search = searchInput.value.toLowerCase();

  products
    .filter(p =>
      (currentCategory === "All" || p.category === currentCategory) &&
      p.name_en.toLowerCase().includes(search)
    )
    .forEach(p => {
      const div = document.createElement("div");
      div.className = "card";
      div.onclick = () =>
        location.href = `product-detail.html?id=${p.id}`;

      div.innerHTML = `
        <img id="img-${p.id}" src="${p.images[p.colors[0]]}">
        <h3>${p.name_en}</h3>
        <p>RM ${p.price}</p>
        <div class="color-row">
          ${p.colors.map(c =>
            `<div class="color-dot"
              style="background:${c}"
              onclick="event.stopPropagation();switchImg(${p.id},'${c}')"></div>`
          ).join("")}
        </div>
      `;
      productList.appendChild(div);
    });
}

function switchImg(id, color) {
  const p = products.find(x => x.id === id);
  document.getElementById(`img-${id}`).src = p.images[color];
}

function toggleCart() {
  cartEl.classList.toggle("show");
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((i, idx) => {
    total += i.price * i.qty;
    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${i.img}">
        <div>
          <div>${i.name}</div>
          <div class="qty">
            <button onclick="chg(${idx},-1)">-</button>
            ${i.qty}
            <button onclick="chg(${idx},1)">+</button>
          </div>
        </div>
      </div>
    `;
  });

  cartTotal.innerText = `Total RM ${total}`;
  cartCount.innerText = cart.reduce((s,i)=>s+i.qty,0);
  localStorage.setItem("cart", JSON.stringify(cart));
}

function chg(i,d){
  cart[i].qty += d;
  if(cart[i].qty<1)cart[i].qty=1;
  updateCart();
}
