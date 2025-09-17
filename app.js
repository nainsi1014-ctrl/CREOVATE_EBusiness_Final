
function q(s){return document.querySelector(s)}
function getCart(){return JSON.parse(localStorage.getItem('cart')||'[]')}
function setCart(c){localStorage.setItem('cart',JSON.stringify(c))}
function addToCart(name,price){const c=getCart(); c.push({name,price}); setCart(c); alert('Added to cart');}
function removeFromCart(idx){const c=getCart(); c.splice(idx,1); setCart(c); renderCart()}
function total(){return getCart().reduce((a,b)=>a+b.price,0)}
function renderCart(){
  const t=document.getElementById('cartTable'); if(!t) return;
  const c=getCart(); t.innerHTML='<tr><th>Item</th><th>Price</th><th></th></tr>'; 
  let s=0; c.forEach((it,i)=>{s+=it.price; const tr=document.createElement('tr'); tr.innerHTML=`<td>${it.name}</td><td>$${it.price.toFixed(2)}</td><td><button class="btn ghost" onclick="removeFromCart(${i})">Remove</button></td>`; t.appendChild(tr)});
  if(q('#total')) q('#total').textContent = s.toFixed(2);
  localStorage.setItem('cartTotal', s.toFixed(2));
}
function renderSummary(){
  const sEl=document.getElementById('summary'); if(!sEl) return;
  const c=getCart(); sEl.innerHTML='<tr><th>Item</th><th>Price</th></tr>';
  let s=0; c.forEach(it=>{ s+=it.price; const tr=document.createElement('tr'); tr.innerHTML=`<td>${it.name}</td><td>$${it.price.toFixed(2)}</td>`; sEl.appendChild(tr)});
  const tr=document.createElement('tr'); tr.innerHTML=`<td><strong>Total</strong></td><td><strong>$${s.toFixed(2)}</strong></td>`; sEl.appendChild(tr);
}
function simulatePay(){
  const c=getCart(); if(c.length===0){alert('Add items first.'); return;}
  const order = { id: nextInvoice(), date: new Date().toISOString(), items:c, total: total() };
  localStorage.setItem('lastOrder', JSON.stringify(order));
  localStorage.removeItem('cart');
  window.location.href='invoice.html';
}
function nextInvoice(){
  const prev=localStorage.getItem('invoiceSeq')||'CRE-INV-0000';
  const n=parseInt(prev.split('-').pop(),10)+1;
  const id='CRE-INV-'+String(n).padStart(4,'0');
  localStorage.setItem('invoiceSeq', id);
  return id;
}
function renderInvoice(){
  const o=JSON.parse(localStorage.getItem('lastOrder')||'null'); if(!o) return;
  document.getElementById('invoiceNo').textContent = o.id;
  document.getElementById('invoiceDate').textContent = new Date(o.date).toLocaleString();
  const tb=document.getElementById('invoiceItems'); let s=0;
  o.items.forEach(it=>{ s+=it.price; const tr=document.createElement('tr'); tr.innerHTML=`<td>${it.name}</td><td>$${it.price.toFixed(2)}</td>`; tb.appendChild(tr)});
  document.getElementById('invoiceTotal').textContent = s.toFixed(2);
}
window.addEventListener('DOMContentLoaded', ()=>{ renderCart(); renderSummary(); renderInvoice(); });
