/* Full bookshelf, with verified edition-specific spine images. */
(()=>{
const menu=document.querySelector('.menu-toggle');if(menu){menu.onclick=()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');menu.textContent=open?'×':'☰';document.body.classList.toggle('header-menu-open',open)};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true')menu.click()})}
function setup(){
 const shelf=document.querySelector('#motionShelf');if(!shelf)return;
 const works=[...data.meetings].filter(m=>m.round!==5).sort((a,b)=>a.round-b.round),spines=new Map((window.BOOK_SPINES||[]).map(s=>[s.round,s]));
 let index=0,paused=true,timer=null;const viewport=document.querySelector('.book-stage-viewport'),reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 shelf.innerHTML=works.map((m,i)=>{const spine=spines.get(m.round);return `<button class="shelf-book ${i===0?'active':''}" style="--spine-width:${Math.max(12,spine.width/spine.height*230).toFixed(1)}px" data-index="${i}" aria-label="${esc(title(m))}${m.status==='planned'?' (다음 모임 책)':''} 펼치기" aria-pressed="${i===0}"><span class="shelf-real-spine"><img src="${esc(spine.image)}" alt="${esc(title(m))} 실제 책등" width="${spine.width}" height="${spine.height}" decoding="async"></span><span class="shelf-real-face">${coverImage(title(m))}</span></button>`}).join('');
 const controls=document.querySelector('#shelfControls');controls.innerHTML='<button id="shelfPrevious" aria-label="이전 책">←</button><span id="shelfPosition" aria-live="polite">01 / 15</span><button id="shelfNext" aria-label="다음 책">→</button>';
 const caption=document.querySelector('#shelfTitle'),meta=document.querySelector('#shelfMeta'),link=document.querySelector('#shelfRead'),toggle=document.querySelector('#motionToggle');
 function center(){const active=shelf.querySelector('.shelf-book.active');if(active)viewport.scrollTo({left:Math.max(0,active.offsetLeft-viewport.clientWidth/2+active.offsetWidth/2),behavior:reduced?'instant':'smooth'})}
 function select(i){index=(i+works.length)%works.length;shelf.querySelectorAll('button').forEach((b,n)=>{b.classList.toggle('active',n===index);b.setAttribute('aria-pressed',String(n===index))});caption.textContent=title(works[index]);meta.textContent=`${String(works[index].round).padStart(2,'0')}회차${works[index].status==='planned'?' · 다음 모임':''} / ${name(recommender(works[index]))}의 추천`;document.querySelector('#shelfPosition').textContent=String(index+1).padStart(2,'0')+' / '+works.length;link.setAttribute('aria-label',title(works[index])+' 모임 기록 보기');center()}
 function stop(){clearInterval(timer);timer=null}function start(){stop();if(!paused&&!document.hidden)timer=setInterval(()=>select(index+1),4800)}function choose(i){select(i);start()}
 shelf.querySelectorAll('button').forEach(b=>{b.onclick=()=>choose(+b.dataset.index);b.onfocus=()=>stop()});shelf.onfocusout=()=>start();shelf.addEventListener('transitionend',e=>{if(e.propertyName==='width'&&e.target.classList.contains('active'))center()});
 document.querySelector('#shelfPrevious').onclick=()=>choose(index-1);document.querySelector('#shelfNext').onclick=()=>choose(index+1);
 shelf.onkeydown=e=>{if(['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();choose(index+(e.key==='ArrowRight'?1:-1));shelf.querySelectorAll('button')[index].focus()}};
 link.onclick=e=>{e.preventDefault();stop();openMeeting(works[index].round)};
 function toggleText(){toggle.textContent=paused?'자동 넘김 ▷':'자동 넘김 정지 Ⅱ';toggle.setAttribute('aria-pressed',String(!paused))}toggle.onclick=()=>{paused=!paused;toggleText();start()};toggleText();select(0);document.addEventListener('visibilitychange',start);document.querySelector('#detail').addEventListener('close',start);
 window.addEventListener('resize',center);
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{if(entries[0].isIntersecting)start();else stop()},{threshold:.15}).observe(document.querySelector('.shelf-stage'));
 document.querySelectorAll('[data-home-round]').forEach(b=>b.onclick=e=>{e.preventDefault();openMeeting(+b.dataset.homeRound)});
 document.querySelector('#homeMeetings').textContent=completedMeetings().length;document.querySelector('#homeBooks').textContent=completedMeetings().filter(m=>m.round!==5).length;document.querySelector('#homeRecommendations').textContent=recommendationRows().length;
 const sources=document.querySelector('#spineSources');if(sources)sources.innerHTML=works.map(m=>{const s=spines.get(m.round);return `<a href="${esc(s.source)}" target="_blank" rel="noopener noreferrer">${esc(title(m))} · ${s.source.includes('yes24')?'예스24':'알라딘'} ↗</a>`}).join('');
}
if(typeof data!=='undefined'&&data)setup();else window.addEventListener('records-ready',setup,{once:true});
})();
