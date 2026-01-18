let products=[],cart=[],currentCategory="All";
const colorMap={Black:"#000",White:"#fff",Grey:"#aaa",Green:"#4f7f52"};

fetch("products.json").then(r=>r.json()).then(d=>{
  products=d;loadCart();renderProducts();
});

function toggleMenu(){
  menu.classList.toggle("show");
  overlay.classList.toggle("show");
}

function setCategory(c){
  currentCategory=c;
  document.querySelectorAll(".cat-btn").forEach(b=>b.classList.toggle("active",b.innerText===c));
  renderProducts();
}

function renderProducts(){
  productList.innerHTML="";
  const s=searchInput.value.toLowerCase();

  products.filter(p=>
    (currentCategory==="All"||p.category===currentCategory)&&
    p.name_en.toLowerCase().includes(s)
  ).forEach(p=>{
    let currentImg=p.images[p.colors[0]];

    const card=document.createElement("div");
    card.className="card";
    card.onclick=()=>location.href=`product-detail.html?id=${p.id}`;

    const img=document.createElement("img");
    img.src=currentImg;

    const colors=document.createElement("div");
    colors.className="color-row";
    p.colors.forEach(c=>{
      const d=document.createElement("span");
      d.className="color-dot";
      d.style.background=colorMap[c]||"#ccc";
      d.onclick=e=>{
        e.stopPropagation();
        img.src=p.images[c];
      };
      colors.appendChild(d);
    });

    card.append(img,colors,document.createTextNode(p.name_en+" RM "+p.price));
    productList.appendChild(card);
  });

  updateCartCount();
}

/* Cart */
function toggleCart(){cartBox.classList.toggle("show");renderCart()}
function renderCart(){
  cartItems.innerHTML="";
  let t=0;
  cart.forEach(i=>{
    t+=i.price*i.qty;
    cartItems.innerHTML+=`
      <div class="cart-item">
        <img src="${i.image}">
        <div>${i.name_en} x ${i.qty}</div>
      </div>`;
  });
  cartTotal.innerText="RM "+t;
}
function saveCart(){localStorage.setItem("cart",JSON.stringify(cart))}
function loadCart(){cart=JSON.parse(localStorage.getItem("cart")||"[]")}
function updateCartCount(){
  cartCount.innerText=cart.reduce((s,i)=>s+i.qty,0);
}
