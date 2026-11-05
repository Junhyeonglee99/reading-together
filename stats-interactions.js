(()=>{
function setup(){
 if(!document.querySelector('#statsSummary'))return;
 const s=computeStats();
 function bookRows(list){return list.map(x=>`<button class="stat-detail-book" data-title="${esc(x.title)}">${coverImage(x.title,'stats-book-cover')}<span><b>${esc(x.title)}</b>${x.note?`<small>${esc(x.note)}</small>`:''}</span></button>`).join('')||'<p class="stat-detail-empty">기록 없음</p>'}
 function wireBooks(target){target.querySelectorAll('[data-title]').forEach(b=>b.onclick=()=>openBook(b.dataset.title))}
 function bindGenre(id,entries,titles){
  const host=document.querySelector(id),donut=host.querySelector('.genre-donut'),items=[...host.querySelectorAll('.genre-key li')];
  const pane=document.createElement('section');pane.className='genre-book-details';pane.hidden=true;pane.setAttribute('aria-live','polite');host.append(pane);
  let selected=-1;
  function show(i){if(i<0||i===selected)return;selected=i;const e=entries[i],books=titles.filter(t=>bookGenre(t)===e.title);pane.hidden=false;pane.innerHTML=`<div class="stat-detail-heading"><h4>${esc(e.title)}</h4><span>${books.length}권 · ${(e.count/entries.reduce((n,e)=>n+e.count,0)*100).toFixed(1)}%</span></div><div class="stat-book-grid">${bookRows(books.map(title=>({title})))}</div>`;items.forEach((li,n)=>li.querySelector('button').setAttribute('aria-pressed',String(i===n)));wireBooks(pane)}
  items.forEach((li,i)=>{const button=document.createElement('button');button.type='button';button.className='genre-select';button.innerHTML=li.innerHTML;button.setAttribute('aria-pressed','false');button.onclick=()=>show(i);button.onpointerenter=e=>{if(e.pointerType==='mouse')show(i)};li.replaceChildren(button)});
  function hit(e){const rect=donut.getBoundingClientRect(),dx=e.clientX-rect.left-rect.width/2,dy=e.clientY-rect.top-rect.height/2,rad=Math.hypot(dx,dy);if(rad<rect.width*.29||rad>rect.width*.5)return;const f=((Math.atan2(dx,-dy)*180/Math.PI+360)%360)/360,total=entries.reduce((n,e)=>n+e.count,0);let sum=0;const i=entries.findIndex(x=>(sum+=x.count)/total>f);show(i)}
  donut.addEventListener('pointermove',e=>{if(e.pointerType==='mouse')hit(e)});donut.addEventListener('click',hit);
 }
 bindGenre('#readGenres',s.readGenres,[...new Map(readMeetings().map(m=>[canonicalBook(title(m)),title(m)])).values()]);
 bindGenre('#recommendGenres',s.recommendGenres,s.books.map(b=>b.title));
 document.querySelectorAll('.rate-medallion').forEach(el=>{const personName=el.querySelector('b').textContent,b=document.createElement('button');b.type='button';b.className=el.className;b.innerHTML=el.innerHTML;b.setAttribute('aria-label',personName+' 추천 및 선정 도서 보기');el.replaceWith(b);b.onclick=()=>{
 const rows=recommendationRows().filter(r=>name(r.poster_raw)===personName),group=new Map();rows.forEach(r=>{const k=canonicalBook(r.title);if(!group.has(k))group.set(k,{title:r.title,count:0});group.get(k).count++});
 const chosen=data.meetings.filter(m=>m.round!==5&&name(recommender(m))===personName).map(m=>({title:title(m),note:m.round+'회차'+(m.status==='planned'?' · 예정 모임 선정':' · 선정')}));
 const content=document.querySelector('#detailContent');content.innerHTML=`<p class="eyebrow">추천 · 선정 기록</p><h2>${esc(personName)}</h2><p>${rows.length}회 추천 · ${chosen.length}권 선정</p><h3>선정된 책</h3><div class="stat-book-grid">${bookRows(chosen)}</div><h3>추천한 책</h3><div class="stat-book-grid">${bookRows([...group.values()].map(x=>({title:x.title,note:x.count+'회 추천'})))}</div>`;wireBooks(content);const dialog=document.querySelector('#detail');if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
 }});
 const tooltip=document.createElement('div');tooltip.className='attendance-book-tooltip';tooltip.hidden=true;tooltip.setAttribute('role','status');document.body.append(tooltip);let activeCell=null,pinned=false;
 function hideAttendance(){tooltip.hidden=true;activeCell=null;pinned=false}
 function showAttendance(cell,m){activeCell=cell;tooltip.innerHTML=coverImage(title(m),'attendance-tip-cover')+'<div><small>'+m.round+'회차</small><b>'+esc(title(m))+'</b></div>';tooltip.hidden=false;const r=cell.getBoundingClientRect(),w=tooltip.offsetWidth,h=tooltip.offsetHeight;tooltip.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left+r.width/2-w/2))+'px';tooltip.style.top=Math.max(8,r.top-h-10<8?r.bottom+10:r.top-h-10)+'px'}
 const meetingList=completedMeetings();document.querySelectorAll('.attendance-stamps').forEach(row=>{[...row.children].forEach((el,i)=>{if(!el.classList.contains('present'))return;const m=meetingList[i],b=document.createElement('button');b.type='button';b.className='attendance-cell present';b.setAttribute('aria-label',m.round+'회차 '+title(m));b.setAttribute('aria-expanded','false');el.replaceWith(b);b.onpointerenter=e=>{if(e.pointerType==='mouse'&&!pinned)showAttendance(b,m)};b.onpointerleave=()=>{if(!pinned)hideAttendance()};b.onfocus=()=>{if(!pinned)showAttendance(b,m)};b.onblur=()=>{if(!pinned)hideAttendance()};b.onclick=()=>{if(pinned&&activeCell===b){hideAttendance();b.setAttribute('aria-expanded','false')}else{pinned=true;showAttendance(b,m);b.setAttribute('aria-expanded','true')}}})});
 document.addEventListener('click',e=>{if(!e.target.closest('.attendance-cell'))hideAttendance()});document.addEventListener('keydown',e=>{if(e.key==='Escape')hideAttendance()});window.addEventListener('scroll',hideAttendance,{passive:true});window.addEventListener('resize',hideAttendance);

}
if(typeof data!=='undefined'&&data&&document.querySelector('#readGenres .genre-donut'))setup();else window.addEventListener('records-ready',setup,{once:true});
})();
