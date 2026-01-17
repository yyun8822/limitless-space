let products = [];
let cart = [];
let currentLang = "en";
let currentCategory = "All";
let selectedProduct = null;
let selectedColor = "";
let selectedSize = "";
let qty = 1;

async function loadProducts() {
  const response = await fetch("products.json");
  products = await response.json();
  renderProducts();

  // 如果在详情页，就加载详情
  if (window.location.pathname.includes("product-detail.html")) {
    loadDetail();
  }

  renderCart();
}

function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function renderProducts() {
  const list = document.getElementById("productList");
  if (!list) return;

  list.innerHTML = "";

  const searchText = document.getElementById("searchInput").value.toLowerCase();

  const filtered = products.filter((p) => {
    const matchCategory = currentCategory === "All" ? true : p.category === currentCategory;
    const matchSearch = p.name_en.toLowerCase().includes(searchText) || p.name_zh.includes(searchText);
    return matchCategory && matchSearch;
  });

  filtered.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      ${p.tag ? `<div class="tag" data-en="${p.tag}" data-zh="${p.tag}">${p.tag}</div>` : ""}
      <img src="${p.images[p.colors[0]] || p.images.default}" alt="${p.name_en}" />
      <div class="info">
        <h3 data-en="${p.name_en}" data-zh="${p.name_zh}">${p.name_en}</h3>
        <p data-en="Price: RM ${p.price}" data-zh="价格: RM ${p.price}">
          Price: RM ${p.price}
        </p>
        <button onclick="viewDetail(${p.id})" data-en="View Details" data-zh="查看详情">
          View Details
        </button>
      </div>
    `;

    list.appendChild(card);
  });

  translate();
}

function viewDetail(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

function setCategory(cat) {
  currentCategory = cat;

  document.querySelectorAll(".menu button").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.innerText === cat || (cat === "All" && btn.innerText === "All")) {
      btn.classList.add("active");
    }
  });

  renderProducts();
}

function applyFilter() {
  renderProducts();
}

function translate() {
  document.querySelectorAll("[data-en]").forEach((el) => {
    const en = el.getAttribute("data-en");
    const zh = el.getAttribute("data-zh");
    el.innerText = currentLang === "zh" ? zh : en;
  });
}

function changeLang(lang) {
  currentLang = lang;
  translate();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (!cartItems) return;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<p data-en="Cart is empty" data-zh="购物车为空">Cart is empty</p>`;
    cartTotal.innerHTML = "";
    checkoutBtn.style.display = "none";
    translate();
    return;
  }

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <span data-en="${item.name_en}" data-zh="${item.name_zh}">${item.name_en}</span>
      <span>RM ${item.price} x ${item.qty}</span>
      <span>
        <button onclick="changeQty(${index}, -1)">-</button>
        <button onclick="changeQty(${index}, 1)">+</button>
        <button onclick="removeItem(${index})">Delete</button>
      </span>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.innerHTML = `<p data-en="Total: RM ${total}" data-zh="总计: RM ${total}">Total: RM ${total}</p>`;
  checkoutBtn.style.display = "block";

  translate();
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart[index].qty = 1;
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
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
      <img id="detailImg" src="${selectedProduct.images.default || selectedProduct.images[selectedProduct.colors[0]]}" alt="${selectedProduct.name_en}" />
      <div class="info">
        <h2 data-en="${selectedProduct.name_en}" data-zh="${selectedProduct.name_zh}">${selectedProduct.name_en}</h2>
        <p data-en="Price: RM ${selectedProduct.price}" data-zh="价格: RM ${selectedProduct.price}">
          Price: RM ${selectedProduct.price}
        </p>

        <label data-en="Color" data-zh="颜色">Color</label>
        <select id="colorSelect"></select>

        <label data-en="Size" data-zh="尺码">Size</label>
        <select id="sizeSelect"></select>

        <div class="qty">
          <button onclick="decreaseQty()">-</button>
          <span id="qtyText">${qty}</span>
          <button onclick="increaseQty()">+</button>
        </div>

        <button onclick="addToCartDetail()" data-en="Add to Cart" data-zh="加入购物车">
          Add to Cart
        </button>
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
  document.getElementById("detailImg").src = selectedProduct.images[selectedColor] || selectedProduct.images.default;

  colorSelect.onchange = () => {
    selectedColor = colorSelect.value;
    document.getElementById("detailImg").src = selectedProduct.images[selectedColor] || selectedProduct.images.default;
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

  translate();
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
    name_zh: selectedProduct.name_zh,
    price: selectedProduct.price,
    color: selectedColor,
    size: selectedSize,
    qty: qty
  });

  renderCart();
  alert("Added to cart!");
}

loadProducts();
