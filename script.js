// Product data (you can add more anytime)
const products = [
  {
    id: 1,
    name_en: "T-Shirt",
    name_zh: "T恤",
    price: 49,
    image: "https://via.placeholder.com/400x400?text=T-Shirt",
  },
  {
    id: 2,
    name_en: "Hoodie",
    name_zh: "连帽衫",
    price: 89,
    image: "https://via.placeholder.com/400x400?text=Hoodie",
  },
  {
    id: 3,
    name_en: "Dress",
    name_zh: "连衣裙",
    price: 99,
    image: "https://via.placeholder.com/400x400?text=Dress",
  }
];

let cart = [];
let currentLang = "en";

function renderProducts() {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${p.image}" alt="${p.name_en}" />
      <div class="info">
        <h3 data-en="${p.name_en}" data-zh="${p.name_zh}">${p.name_en}</h3>
        <p data-en="Price: RM ${p.price}" data-zh="价格: RM ${p.price}">
          Price: RM ${p.price}
        </p>
        <button onclick="addToCart(${p.id})" data-en="Add to Cart" data-zh="加入购物车">
          Add to Cart
        </button>
      </div>
    `;

    list.appendChild(card);
  });

  translate();
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  cart.push(product);
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");

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
    total += item.price;

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <span data-en="${item.name_en}" data-zh="${item.name_zh}">${item.name_en}</span>
      <span>RM ${item.price}</span>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.innerHTML = `<p data-en="Total: RM ${total}" data-zh="总计: RM ${total}">Total: RM ${total}</p>`;
  checkoutBtn.style.display = "block";

  translate();
}

function checkout() {
  let message = "Order details:%0A";
  let total = 0;

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name_en} - RM ${item.price}%0A`;
    total += item.price;
  });

  message += `Total: RM ${total}%0A`;
  message += "Please send me the shipping address and size.";

  window.open(`https://wa.me/60173988114?text=${message}`, "_blank");
}

function changeLang(lang) {
  currentLang = lang;
  translate();
}

function translate() {
  document.querySelectorAll("[data-en]").forEach((el) => {
    const en = el.getAttribute("data-en");
    const zh = el.getAttribute("data-zh");
    el.innerText = currentLang === "zh" ? zh : en;
  });
}

// Run on load
renderProducts();
renderCart();
