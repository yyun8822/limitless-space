let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedProduct = null;
let selectedColor = "";
let selectedSize = "";
let qty = 1;

async function loadProducts() {
  const response = await fetch("products.json");
  products = await response.json();
  loadDetail();
  renderCart();
}

function loadDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  selectedProduct = products.find((p) => p.id == id);
  if (!selectedProduct) return;

  const detail = document.getElementById("detail");
  detail.innerHTML = `
    <img id="detailImg" src="${selectedProduct.images.default}" alt="${selectedProduct.name_en}" />
    <div class="info">
      <h2>${selectedProduct.name_en}</h2>
      <p>RM ${selectedProduct.price}</p>

      <div class="colors" id="colorList"></div>

      <div class="qty">
        <button onclick="decreaseQty()">-</button>
        <span id="qtyText">${qty}</span>
        <button onclick="increaseQty()">+</button>
      </div>

      <button class="addToCart" onclick="addToCartDetail()">Add to Cart</button>
    </div>
  `;

  const colorList = document.getElementById("colorList");
  selectedProduct.colors.forEach(c => {
    const btn = document.createElement("button");
    btn.innerText = c;
    btn.onclick = () => selectColor(c);
    colorList.appendChild(btn);
  });

  selectedColor = selectedProduct.colors[0];
  selectedSize = selectedProduct.sizes[0];
  selectColor(selectedColor);
}

function selectColor(color) {
  selectedColor = color;
  document.getElementById("detailImg").src = selectedProduct.images[color];
}

function increaseQty() {
  qty++;
  document.getElementById("qtyText").innerText = qty;
}

function decreaseQty() {
  if (qty > 1) qty--;
  document.getElementById("qtyText").innerText = qty;
}

function addToCartDetail() {
  cart.push({
    id: selectedProduct.id,
    name_en: selectedProduct.name_en,
    price: selectedProduct.price,
    color: selectedColor,
    size: selectedSize,
    qty: qty
  });
  saveCart();
  renderCart();
  alert("Added to cart!");
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
