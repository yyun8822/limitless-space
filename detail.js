let products = [];
let cart = [];
let selectedProduct = null;
let selectedColor = "";
let selectedSize = "";
let qty = 1;

function loadCart() {
  const stored = localStorage.getItem("ls_cart");
  cart = stored ? JSON.parse(stored) : [];
}

function saveCart() {
  localStorage.setItem("ls_cart", JSON.stringify(cart));
}

async function loadProducts() {
  const response = await fetch("products.json");
  products = await response.json();
  loadDetail();
  renderCart();
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("show");
}

function toggleCart() {
  const cartEl = document.getElementById("cart");
  cartEl.style.display = cartEl.style.display === "block" ? "none" : "block";
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const cartCount = document.getElementById("cartCount");

  cartItems.innerHTML = "";
  cartCount.innerText = cart.reduce((acc, item) => acc + item.qty, 0);

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
      <span>${item.name_en} (${item.color}/${item.size})</span>
      <span>RM ${item.price} x ${item.qty}</span>
      <span>
        <button onclick="changeQty(${index}, -1)">-</button>
        <button onclick="changeQty(${index}, 1)">+</button>
        <button onclick="removeItem(${index})">Delete</button>
      </span>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.innerHTML = `<p>Total: RM ${total}</p>`;
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

function loadDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  selectedProduct = products.find((p) => p.id == id);

  if (!selectedProduct) return;

  const detail = document.getElementById("detail");
  detail.innerHTML = `
    <div class="box">
      <img id="detailImg" src="${selectedProduct.images[selectedProduct.colors[0]]}" alt="${selectedProduct.name_en}" />
      <div class="info">
        <h2>${selectedProduct.name_en}</h2>
        <p>RM ${selectedProduct.price}</p>

        <label>Color</label>
        <select id="colorSelect"></select>

        <label>Size</label>
        <select id="sizeSelect"></select>

        <div class="qty">
          <button onclick="decreaseQty()">-</button>
          <span id="qtyText">${qty}</span>
          <button onclick="increaseQty()">+</button>
        </div>

        <button onclick="addToCartDetail()" class="add-btn">Add to Cart</button>
      </div>
    </div>
  `;

  const colorSelect = document.getElementById("colorSelect");
  selectedProduct.colors.forEach(c => {
    const option = document.createElement("option");
    option.value = c;
    option.innerText = c;
    colorSelect.appendChild(option);
  });

  selectedColor = selectedProduct.colors[0];
  document.getElementById("detailImg").src = selectedProduct.images[selectedColor];

  colorSelect.onchange = () => {
    selectedColor = colorSelect.value;
    document.getElementById("detailImg").src = selectedProduct.images[selectedColor];
  };

  const sizeSelect = document.getElementById("sizeSelect");
  selectedProduct.sizes.forEach(s => {
    const option = document.createElement("option");
    option.value = s;
    option.innerText = s;
    sizeSelect.appendChild(option);
  });
  selectedSize = selectedProduct.sizes[0];

  sizeSelect.onchange = () => selectedSize = sizeSelect.value;
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
  const exists = cart.find(c => c.id === selectedProduct.id && c.color === selectedColor && c.size === selectedSize);

  if (exists) {
    exists.qty += qty;
  } else {
    cart.push({
      id: selectedProduct.id,
      name_en: selectedProduct.name_en,
      price: selectedProduct.price,
      color: selectedColor,
      size: selectedSize,
      qty: qty
    });
  }

  saveCart();
  renderCart();
  alert("Added to cart!");
}

loadCart();
loadProducts();
