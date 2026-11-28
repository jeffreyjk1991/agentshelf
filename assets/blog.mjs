const box=document.querySelector('#blog-searchbox'),input=document.querySelector('#blog-search'),count=document.querySelector('#blog-count'),empty=document.querySelector('#blog-empty');
if(box&&input&&count&&empty){
 const groups=[...document.querySelectorAll('[data-blog-group]')],cards=[...document.querySelectorAll('[data-blog-card]')];
 box.hidden=false;
 const update=()=>{const words=input.value.trim().toLowerCase().split(/\s+/).filter(Boolean);let n=0;
  for(const group of groups){const category=group.querySelector('h2')?.textContent.toLowerCase()||'';for(const card of group.querySelectorAll('[data-blog-card]')){const text=(category+' '+card.textContent).toLowerCase();card.hidden=!words.every(w=>text.includes(w));if(!card.hidden)n++;}group.hidden=![...group.querySelectorAll('[data-blog-card]')].some(c=>!c.hidden);}
  count.textContent=words.length?n+' of '+cards.length+' articles':'';empty.hidden=n!==0;
 };input.addEventListener('input',update);
}
