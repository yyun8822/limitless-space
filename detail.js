let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let idx = 0;
let product;

fetch("products.json")
  .then(r=>r.json())
  .then(d=>{
    products = d;
    const id = new URLSearchParams(location.search).get("id");
    product = products.find(p=>p.id==id);
    render();
    autoSlide();
  });

function render() {
  detail.innerHTML = `
    <img id="img" class="detail-img" src="${product.images[product.colors[idx]]}">
    <h2>${product.name_en}</h2>
    <p>RM ${product.price}</p>
    <div class="color-row">
      ${product.colors.map((c,i)=>`
        <div class="color-btn" style="background:${c}"
          onclick="setColor(${i})"></div>`).join("")}
    </div>
    <button onclick="add()">Add to Cart</button>
  `;

  swipe();
}

function setColor(i){ idx=i; update(); }
function update(){ img.src = product.images[product.colors[idx]]; }

function autoSlide(){
  setInterval(()=>{ idx=(idx+1)%product.colors.length; update(); },4000);
}

function swipe(){
  let x;
  img.ontouchstart=e=>x=e.touches[0].clientX;
  img.ontouchend=e=>{
    if(x-e.changedTouches[0].clientX>50) idx++;
    if(e.changedTouches[0].clientX-x>50) idx--;
    idx=(idx+product.colors.length)%product.colors.length;
    update();
  }
}

function add(){
  cart.push({id:product.id,qty:1});
  localStorage.setItem("cart",JSON.stringify(cart));
  alert("Added");
}
