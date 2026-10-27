(()=>{
const root=document.querySelector('.archive-page');if(!root)return;
const menuButton=document.querySelector('#archiveMenuButton'),menu=document.querySelector('#archiveMenu');
function closeMenu(){root.classList.remove('menu-open');menu.hidden=true;menuButton.textContent='Menu';menuButton.setAttribute('aria-expanded','false')}
menuButton.onclick=()=>{const open=!root.classList.contains('menu-open');root.classList.toggle('menu-open',open);menu.hidden=!open;menuButton.textContent=open?'Close':'Menu';menuButton.setAttribute('aria-expanded',String(open))};
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
function setup(){
 const works=data.meetings.filter(m=>m.round!==5).sort((a,b)=>a.round-b.round);let index=0,all=false;
 const colors=['#c9d4bf','#e7d9c5','#d8aaa0','#d3c5bb','#c8d4d9','#d9c6c8','#b8d9cd','#c2c5de','#dbd3b9','#bfdce2','#c9d5e0','#e2c5ad','#d7cbbc','#d5c4bb','#d9d2c6'];
 const img=document.querySelector('#archiveImage'),grid=document.querySelector('#archiveGrid'),toggle=document.querySelector('#archiveAll');
 function render(){const m=works[index],c=coverInfo(title(m));if(c){img.src=c.embedded||c.url;img.alt=title(m)+' 책 표지'}root.style.setProperty('--archive-bg',colors[index%colors.length]);document.querySelector('#archiveYear').textContent=(m.meeting_date||m.record_date||'2026').slice(0,4);document.querySelector('#archiveRound').textContent=String(m.round).padStart(2,'0');document.querySelector('#archiveTitle').textContent=title(m)+(m.status==='planned'?' · 다음 모임':'');document.querySelector('#archiveCover').setAttribute('aria-label',title(m)+' 모임 기록 열기');toggle.textContent='All ('+works.length+')';toggle.setAttribute('aria-expanded',String(all));grid.hidden=!all;root.classList.toggle('grid-open',all)}
 function choose(i){index=(i+works.length)%works.length;render()}
 document.querySelector('#archivePrev').onclick=()=>choose(index-1);document.querySelector('#archiveNext').onclick=()=>choose(index+1);
 toggle.onclick=()=>{all=!all;render();window.scrollTo({top:0,behavior:'instant'})};document.querySelector('#archiveCover').onclick=()=>openMeeting(works[index].round);
 grid.innerHTML=works.map((m,i)=>'<button data-index="'+i+'">'+coverImage(title(m))+'<small>'+String(m.round).padStart(2,'0')+(m.status==='planned'?' · NEXT':'')+'</small><span>'+esc(title(m))+'</span></button>').join('');grid.querySelectorAll('button').forEach(b=>b.onclick=()=>{all=false;choose(+b.dataset.index);window.scrollTo({top:0,behavior:'instant'})});
 let start=null;const stage=document.querySelector('.archive-stage');stage.addEventListener('touchstart',e=>{start={x:e.touches[0].clientX,y:e.touches[0].clientY}},{passive:true});stage.addEventListener('touchend',e=>{if(!start)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){choose(index+(dx<0?1:-1))}start=null},{passive:true});
 stage.onkeydown=e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();choose(index+(e.key==='ArrowRight'?1:-1))}};
 render();
}
if(typeof data!=='undefined'&&data)setup();else window.addEventListener('records-ready',setup,{once:true});
})();
