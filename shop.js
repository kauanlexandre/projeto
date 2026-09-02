import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
const supabase=createClient('https://jfmzukwfymuwamsldojx.supabase.co','sb_publishable_ULWoIXtScA85GN58Tg4gkA_3o0PJvdQ');
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));
async function renderShop(){
 const box=$('#shopList'); if(!box)return;
 const {data:items,error}=await supabase.from('shop_items').select('*').eq('active',true).order('created_at');
 if(error){box.innerHTML='<p class="muted">Não foi possível carregar a loja.</p>';return;}
 const {data:{session}}=await supabase.auth.getSession();
 let owned=new Map();
 if(session){const {data:inv}=await supabase.from('inventory').select('item_id,quantity').eq('user_id',session.user.id);(inv||[]).forEach(x=>owned.set(x.item_id,x.quantity));}
 box.innerHTML=(items||[]).map(i=>`<article class="card shopCard"><span class="tag">${esc(i.rarity)}</span><h3>${esc(i.name)}</h3><p class="muted">${esc(i.description)}</p><strong>${i.price_coins>0?`${i.price_coins} moedas`:`${i.price_gems} gemas`}</strong><button class="btn primary shopBuy" data-id="${i.id}" ${session?'':'disabled'}>${session?'Comprar':'Faça login'}</button>${owned.has(i.id)?`<small class="muted">Você possui ${owned.get(i.id)}</small>`:''}</article>`).join('')||'<p class="muted">A loja está vazia.</p>';
 box.querySelectorAll('.shopBuy').forEach(b=>b.onclick=async()=>{
   b.disabled=true; const {data,error}=await supabase.rpc('purchase_shop_item',{p_item_id:b.dataset.id});
   if(error){b.disabled=false; alert(error.message.includes('INSUFFICIENT_FUNDS')?'Saldo insuficiente.':'Não foi possível concluir a compra.');return;}
   await renderShop(); alert(`Comprado: ${data?.item||'item'}`);
 });
}
renderShop();
supabase.auth.onAuthStateChange(()=>setTimeout(renderShop,0));
