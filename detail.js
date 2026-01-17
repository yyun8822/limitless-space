let products = [];
let cart = [];
let selectedProduct = null;
let selectedColor = "";
let qty = 1;

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
}

function loadDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  selectedProduct = products.find(p => p.id == id);
  if (!selectedProduct) return;

  selectedColor = selectedProduct.colors[0];
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
        ${selectedProduct.colors.map(c => `
          <button class="color-btn" style="background:${c.toLowerCase()}" onclick="changeColor('${c}')"></button>
        `).join("")}
      </div>

      <div class="slider-row">
        <button class="nav-btn" onclick="prevColor()">←</button>
        <button class="nav-btn" onclick="nextColor()">→</button>
      </div>

      <div class="qty-row">
        <button onclick="changeQty(-1)">-</button>
        <span id="qtyText">${qty}</span>
        <button onclick="changeQty(1)">+</button>
      </div>

      <button class="add-btn" onclick="addToCart()">Add to Cart</button>
    </div>
  `;

  updateImage();
}

function changeColor(color) {
  selectedColor = color;
  updateImage();
}

function updateImage() {
  const img = document.getElementById("detailImg");
  img.src = selectedProduct.images[selectedColor];
}

function prevColor() {
  let idx = selectedProduct.colors.indexOf(selectedColor);
  idx = (idx - 1 + selectedProduct.colors.length) % selectedProduct.colors.length;
  selectedColor = selectedProduct.colors[idx];
  updateImage();
}

function nextColor() {
  let idx = selectedProduct.colors.indexOf(selectedColor);
  idx = (idx + 1) % selectedProduct.colors.length;
  selectedColor = selectedProduct.colors[idx];
  updateImage();
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
    size: selectedProduct.sizes[0],
    qty
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  showToast(); // 显示小提示
}
loadProducts();
