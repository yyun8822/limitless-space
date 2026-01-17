let products = [];
let currentCategory = 'all';
let currentProduct = null;

fetch('products.json')
  .then(r => r.json())
  .then(data => {
    products = data;
    renderProducts();
  });

function toggleMenu() {
  document.getElementById('sideMenu').classList.toggle('open');
}

function filterCategory(cat) {
  currentCategory = cat;
  toggleMenu();
  renderProducts();
}

function renderProducts() {
  const keyword = document.getElementById('searchInput').value.toLowerCase();
  const list = document.getElementById('product-list');

  list.innerHTML = products
    .filter(p =>
      (currentCategory === 'all' || p.category === currentCategory) &&
      p.name_en.toLowerCase().includes(keyword)
    )
    .map(p => `
      <div class="product-card" onclick="openProduct(${p.id})">
        <img src="${p.images.default || p.images[p.colors[0]]}">
        <h4>${p.name_en}</h4>
        <p>RM ${p.price}</p>
      </div>
    `).join('');
}

function openProduct(id) {
  currentProduct = products.find(p => p.id === id);
  document.getElementById('detailImg').src =
    currentProduct.images.default || currentProduct.images[currentProduct.colors[0]];
  document.getElementById('detailName').innerText = currentProduct.name_en;
  document.getElementById('detailPrice').innerText = 'RM ' + currentProduct.price;

  document.getElementById('colorOptions').innerHTML =
    currentProduct.colors.map(c =>
      `<button onclick="changeColor('${c}')">${c}</button>`
    ).join('');

  document.getElementById('sizeSelect').innerHTML =
    currentProduct.sizes.map(s => `<option>${s}</option>`).join('');

  document.getElementById('productModal').style.display = 'block';
}

function changeColor(color) {
  document.getElementById('detailImg').src = currentProduct.images[color];
}

function closeModal() {
  document.getElementById('productModal').style.display = 'none';
}

function addToCart() {
  alert('已加入购物车（下一步可接 WhatsApp 下单）');
}
