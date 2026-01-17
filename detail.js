let products = [];
let cart = [];
let selectedProduct = null;
let selectedColor = "";
let qty = 1;
let imgIndex = 0;

function loadProducts() {
  fetch("products.json")
    .then(res => res.json())
    .then(data => {
      products = data;
      loadCart();
      loadDetail();
    });
}

function loadCart() {
  const stored = localStorage.getItem("cart");
  if (stored) cart = JSON.parse(stored);
  updateCartCount();
}

function loadDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  selectedProduct = products.find(p => p.id == id);
  if (!selectedProduct) return;

  selectedColor = selectedProduct.colors[0];
  imgIndex = 0;

  renderDetail();
}

function renderDetail() {
  const detail = document.getElementById("detail");
  detail.innerHTML = `
    <img id="detailImg" class="detail-img" src="${selectedProduct.images[selectedColor]}" alt="${selectedProduct.name_en}">
    <div class="detail-info">
      <h2>${selectedProduct.name_en}</h2>
      <p>RM ${selectedProduct.price}</p>

      <div class="color-row">
        ${selectedProduct.colors.map(c => `<div class="color-dot ${c === selectedColor ? 'active' : ''}" style="background:${colorToHex(c)}" onclick="changeColor('${c}')"></div>`).join("")}
      </div>

      <div class="qty-row">
        <button onclick="changeQty(-1)">-</button>
        <span id="qtyText">${qty}</span>
        <button onclick="changeQty(1)">+</button>
      </div>

      <div class="slider-row">
        <button onclick="prevImg()">←</button>
        <button onclick="nextImg()">→</button>
      </div>

      <button class="add-btn" onclick="addToCart()">Add to Cart</button>
    </div>
  `;

  updateImage();
}

function changeColor(color) {
  selectedColor = color;
  imgIndex = selectedProduct.colors.indexOf(color);
  updateImage();
  renderDetail(); // 让圆点 active 更新
}

function updateImage() {
  const img = document.getElementById("detailImg");
  img.src = selectedProduct.images[selectedColor];
}

function changeQty(delta) {
  qty += delta;
  if (qty < 1) qty = 1;
  document.getElementById("qtyText").innerText = qty;
}

function addToCart() {
  const item = cart.find(c => c.id === selectedProduct.id && c.color === selectedColor);
  if (item) item.qty += qty;
  else cart.push({
    id: selectedProduct.id,
    name_en: selectedProduct.name_en,
    price: selectedProduct.price,
    color: selectedColor,
    qty
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  showToast();
  updateCartCount();
}

function prevImg() {
  imgIndex = (imgIndex - 1 + selectedProduct.colors.length) % selectedProduct.colors.length;
  selectedColor = selectedProduct.colors[imgIndex];
  renderDetail();
}

function nextImg() {
  imgIndex = (imgIndex + 1) % selectedProduct.colors.length;
  selectedColor = selectedProduct.colors[imgIndex];
  renderDetail();
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("show");
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Cart is empty</p>";
    cartTotal.innerHTML = "";
    checkoutBtn.style.display = "none";
    return;
  }

  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div>
        <div>${item.name_en}</div>
        <div>${item.color}</div>
      </div>
      <div>
        <div>RM ${item.price} x ${item.qty}</div>
        <div>
          <button onclick="changeQtyCart(${idx}, -1)">-</button>
          <button onclick="changeQtyCart(${idx}, 1)">+</button>
          <button onclick="removeItem(${idx})">Delete</button>
        </div>
      </div>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.innerHTML = `<p>Total: RM ${total}</p>`;
  checkoutBtn.style.display = "block";
}

function changeQtyCart(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart[idx].qty = 1;
  saveCart();
  renderCart();
  updateCartCount();
}

function removeItem(idx) {
  cart.splice(idx, 1);
  saveCart();
  renderCart();
  updateCartCount();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").innerText = count;
}

function checkout() {
  let msg = "Order details:%0A";
  let total = 0;
  cart.forEach((item, i) => {
    msg += `${i+1}. ${item.name_en} (${item.color}) x ${item.qty} - RM ${item.price}%0A`;
    total += item.price * item.qty;
  });
  msg += `Total: RM ${total}%0A`;
  window.open(`https://wa.me/60173988114?text=${msg}`, "_blank");
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 800);
}

// 把颜色名转成颜色（你也可以直接在 products.json 用 hex）
function colorToHex(color) {
  const map = {
    "Black": "#000000",
    "White": "#ffffff",
    "Grey": "#777777",
    "Green": "#00a86b",
    "Blue": "#0d6efd",
    "Red": "#ff0000",
    "Pink": "#ff69b4",
    "Yellow": "#ffd700"
  };
  return map[color] || "#ccc";
}

loadProducts();
