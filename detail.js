const product = JSON.parse(localStorage.getItem("currentProduct"));
let qty = 1;

const gallery = document.getElementById("gallery");
const colors = document.getElementById("colors");

document.getElementById("name").innerText = product.name_zh;
document.getElementById("price").innerText = "RM " + product.price;

function renderImages(color) {
  gallery.innerHTML = "";
  const img = document.createElement("img");
  img.src = product.images[color] || product.images.default;
  gallery.appendChild(img);
}

product.colors.forEach(c => {
  const div = document.createElement("div");
  div.className = "color";
  div.innerHTML = `<img src="${product.images[c]}">`;
  div.onclick = () => renderImages(c);
  colors.appendChild(div);
});

renderImages(product.colors[0]);

function changeQty(n) {
  qty = Math.max(1, qty + n);
  document.getElementById("qty").innerText = qty;
}

function addToCart() {
  alert("Added to cart");
}
