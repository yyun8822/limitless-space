let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedProduct;
let qty = 1;

async function loadProducts() {
  const response = await fetch("products.json");
  products = await response.json();
  loadDetail();
  updateCartCount();
}

function toggleMenu() {
  document.getElementById("menu").classList.toggle("open");
}

function toggleCart() {
  document.getElementById("cartModal").classList.toggle("open");
  renderCart();
}

function updateCartCount() {
  document.getElementById("cartCount").innerText = cart.length;
}

function loadDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"));
  selectedProduct = products.find(p => p.id === id);

  const detail = document.getElementById("detail");
  detail.innerHTML = `
    <div class="detailBox">
      <div class="slider" id="slider"></div>
      <div class="info">
        <h2>${selectedProduct.name_en}</h2>
        <p>RM ${selectedProduct.price}</p>
        <div id="colorDots" class="colorDots"></div>
        <div class="qty">
          <button onclick="changeQty(-1)">-</button>
          <span id="qtyText">${qty}</span>
          <button onclick="changeQty(1)">+</button>
        </div>
        <button onclick="addToCart()">Add to Cart</button>
      </div>
    </div>
  `;

  renderSlider();
  renderColorDots();
}

function renderSlider() {
  const slider = document.getElementById("slider");
  slider.innerHTML = "";

  selectedProduct.colors.forEach(color => {
    const img = document.createElement("img");
    img.src = selectedProduct.images[color];
    slider.appendChild(img);
  });

  let startX = 0;
  let currentIndex = 0;

  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  slider.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    if (endX - startX > 50) currentIndex = Math.max(0, currentIndex - 1);
    if (startX - endX > 50) currentIndex = Math.min(selectedProduct.colors.length - 1, currentIndex + 1);
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
  });
}

function renderColorDots() {
  const colorDots = document.getElementById("colorDots");
  colorDots.innerHTML = "";

  selectedProduct.colors.forEach((color, index) => {
    const dot = document.createElement("span");
    dot.className = "colorDot";
    dot.style.background = color.toLowerCase();
    dot.onclick = () => {
      document.getElementById("slider").style.transform = `translateX(-${index * 100}%)`;
    };
    colorDots.appendChild(dot);
  });
}

function changeQty(delta) {
  qty += delta;
  if (qty < 1) qty = 1;
  document.getElementById("qtyText").innerText = qty;
}

function addToCart() {
  cart.push({
    id: selectedProduct.id,
    name_en: selectedProduct.name_en,
    price: selectedProduct.price,
    qty: qty
  });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Added to cart!");
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <span>${item.name_en}</span>
      <span>RM ${item.price} x ${item.qty}</span>
      <span>
        <button onclick="changeQtyCart(${index}, -1)">-</button>
        <button onclick="changeQtyCart(${index}, 1)">+</button>
        <button onclick="removeItem(${index})">Delete</button>
      </span>
    `;
    cartItems.appendChild(div);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById("cartTotal").innerText = `Total: RM ${total}`;
}

function changeQtyCart(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty < 1) cart[index].qty = 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function checkout() {
  alert("Checkout not implemented yet.");
}

loadProducts();
