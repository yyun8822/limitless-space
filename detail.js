let products = [];
let cart = [];
let selectedProduct = null;
let selectedColor = "";
let qty = 1;
let imgIndex = 0;
let autoSlide;

/* 安全颜色映射（关键） */
const colorMap = {
  Black: "#000",
  White: "#fff",
  Grey: "#aaa",
  Gray: "#aaa",
  Red: "#c00",
  Blue: "#0066cc"
};

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
  imgIndex = 0;
  qty = 1;

  renderDetail();
}

function renderDetail() {
  const detail = document.getElementById("detail");

  detail.innerHTML = `
    <div class="carousel" id="carousel">
      <div class="carousel-track" id="carouselTrack"></div>
    </div>

    <div class="detail-info">
      <h2>${selectedProduct.name_en}</h2>
      <p>RM ${selectedProduct.price}</p>

      <div class="color-row">
        ${selectedProduct.colors.map(c => `
          <span 
            class="color-dot" 
            style="background:${colorMap[c] || '#ccc'}"
            onclick="changeColor('${c}')">
          </span>
        `).join("")}
      </div>

      <div class="qty-row">
        <button onclick="changeQty(-1)">-</button>
        <span id="qtyText">${qty}</span>
        <button onclick="changeQty(1)">+</button>
      </div>

      <button class="add-btn" onclick="addToCart()">Add to Cart</button>
    </div>
  `;

  renderCarousel();
  enableSwipe();
  startAutoSlide();
}

/* ===== Carousel ===== */
function renderCarousel() {
  const track = document.getElementById("carouselTrack");
  track.innerHTML = "";

  selectedProduct.colors.forEach(c => {
    const img = document.createElement("img");
    img.src = selectedProduct.images[c];
    track.appendChild(img);
  });

  updateCarousel();
}

function updateCarousel() {
  document.getElementById("carouselTrack")
    .style.transform = `translateX(-${imgIndex * 100}%)`;
}

/* 自动轮播 */
function startAutoSlide() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => {
    imgIndex = (imgIndex + 1) % selectedProduct.colors.length;
    selectedColor = selectedProduct.colors[imgIndex];
    updateCarousel();
  }, 3500);
}

/* 手势滑动 */
function enableSwipe() {
  const carousel = document.getElementById("carousel");
  let startX = 0;

  carousel.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  carousel.addEventListener("touchend", e => {
    const diff = e.changedTouches[0].clientX - startX;
    if (diff > 50) prevImg();
    if (diff < -50) nextImg();
  });
}

function prevImg() {
  imgIndex = (imgIndex - 1 + selectedProduct.colors.length) % selectedProduct.colors.length;
  updateCarousel();
}

function nextImg() {
  imgIndex = (imgIndex + 1) % selectedProduct.colors.length;
  updateCarousel();
}

function changeColor(color) {
  selectedColor = color;
  imgIndex = selectedProduct.colors.indexOf(color);
  updateCarousel();
}

/* Cart */
function changeQty(delta) {
  qty = Math.max(1, qty + delta);
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
  alert("Added to cart");
}

loadProducts();
