const id=new URLSearchParams(location.search).get("id");
let index=0,imgs=[];

fetch("products.json").then(r=>r.json()).then(p=>{
  const prod=p.find(x=>x.id==id);
  imgs=Object.values(prod.images);
  render();
  setInterval(next,3000);
});

function render(){
  slider.innerHTML=`<img src="${imgs[index]}">`;
  dots.innerHTML=imgs.map((_,i)=>`<span ${i==index?'style="font-weight:bold"':''}>•</span>`).join("");
}
function next(){index=(index+1)%imgs.length;render();}

let startX=0;
slider.addEventListener("touchstart",e=>startX=e.touches[0].clientX);
slider.addEventListener("touchend",e=>{
  const dx=e.changedTouches[0].clientX-startX;
  if(dx>50)index=(index-1+imgs.length)%imgs.length;
  if(dx<-50)index=(index+1)%imgs.length;
  render();
});
