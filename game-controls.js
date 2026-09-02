const restart=document.querySelector('#restartGame');
if(restart){
 restart.addEventListener('click',()=>{
   const title=document.querySelector('#modalTitle')?.textContent?.trim();
   const card=[...document.querySelectorAll('.gameCard')].find(c=>c.querySelector('h3')?.textContent?.trim()===title);
   if(card) card.click();
 });
}
