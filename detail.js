let products=[],cart=JSON.parse(localStorage.getItem("cart"))||[];
let qty=1,idx=0,p;

fetch("products.json").then(r=>r.json()).then(d=>{
  products=d;
  p=products.find(x=>x.id==new URLSearchParams(location.search).get("id"));
  draw(); auto();
});

function draw(){
  detail.innerHTML=`
    <img id="img" class="detail-img" src="${p.images[p.colors[0]]}">
    <h2>${p.name_en}</h2>
    <p>RM ${p.price}</p>

    <div class="color-row">
      ${p.colors.map((c,i)=>`
        <div class="color-dot" style="background:${c}"
          onclick="set(${i})"></div>`).join("")}
    </div>

    <div class="qty-row">
      <button onclick="q(-1)">-</button>
      <span>${qty}</span>
      <button onclick="q(1)">+</button>
    </div>

    <button onclick="add()">Add to Cart</button>
  `;
  swipe();
}

function set(i){idx=i;img.src=p.images[p.colors[i]];}
function q(d){qty=Math.max(1,qty+d);draw();}
function add(){
  cart.push({
    id:p.id,name:p.name_en,price:p.price,
    img:p.images[p.colors[idx]],qty
  });
  localStorage.setItem("cart",JSON.stringify(cart));
  alert("Added");
}
function auto(){setInterval(()=>{idx=(idx+1)%p.colors.length;set(idx)},4000);}
function swipe(){
  let x;
  img.ontouchstart=e=>x=e.touches[0].clientX;
  img.ontouchend=e=>{
    idx+=x-e.changedTouches[0].clientX>0?1:-1;
    idx=(idx+p.colors.length)%p.colors.length;
    set(idx);
  }
}
