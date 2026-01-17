let products=[], cart=[], current=null, lang='en', cat='all', color='';

fetch('products.json').then(r=>r.json()).then(d=>{
  products=d; renderProducts();
});

function toggleMenu(){ document.getElementById('menu').classList.toggle('open'); }
function toggleLang(){ lang=lang==='en'?'zh':'en'; renderProducts(); }
function filterCat(c){ cat=c; renderProducts(); }

function renderProducts(){
  const list=document.getElementById('productList');
  const newList=document.getElementById('newList');

  const show=p=>cat==='all'||p.category===cat;

  list.innerHTML=products.filter(show).map(p=>card(p)).join('');
  newList.innerHTML=products.filter(p=>p.tag==='new').map(p=>card(p)).join('');
}

function card(p){
  const firstColor=Object.keys(p.colors)[0];
  return `
  <div onclick="openProduct(${p.id})">
    <img src="${p.colors[firstColor].images[0]}">
    <p>${p.name[lang]}</p>
    <p>RM ${p.price}</p>
  </div>`;
}

function openProduct(id){
  current=products.find(p=>p.id===id);
  color=Object.keys(current.colors)[0];
  document.getElementById('detailImg').src=current.colors[color].images[0];
  document.getElementById('colorBtns').innerHTML=
    Object.keys(current.colors).map(c=>`<button onclick="setColor('${c}')">${c}</button>`).join('');
  document.getElementById('sizeSelect').innerHTML=
    current.sizes.map(s=>`<option>${s}</option>`).join('');
  document.getElementById('modal').style.display='block';
}

function setColor(c){
  color=c;
  document.getElementById('detailImg').src=current.colors[c].images[0];
}

function addToCart(){
  const size=document.getElementById('sizeSelect').value;
  const item=cart.find(i=>i.id===current.id&&i.color===color&&i.size===size);
  item?item.qty++:cart.push({id:current.id,name:current.name[lang],price:current.price,color,size,qty:1});
  renderCart();
}

function renderCart(){
  document.getElementById('cartItems').innerHTML=
    cart.map((i,idx)=>`
      <div>
        ${i.name} ${i.color}/${i.size}
        <button onclick="chg(${idx},-1)">-</button>
        ${i.qty}
        <button onclick="chg(${idx},1)">+</button>
      </div>
    `).join('');
}

function chg(i,n){ cart[i].qty+=n; if(cart[i].qty<=0)cart.splice(i,1); renderCart(); }

function checkout(){
  let msg='【Limitless Space Order】%0A', total=0;
  cart.forEach(i=>{msg+=`${i.name} ${i.color}/${i.size} x${i.qty}%0A`; total+=i.price*i.qty;});
  msg+=`Total: RM ${total}`;
  window.open(`https://wa.me/60173988114?text=${msg}`);
}

function closeModal(){ document.getElementById('modal').style.display='none'; }
