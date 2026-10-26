/* Theatre-inspired reading archive: motion is optional and controls stay usable. */
(()=>{
const icons=['<path d="m3 10 9-7 9 7v11H3Z"/><path d="M9 21v-8h6v8"/>','<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>','<path d="M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3Z"/><path d="M12 6v16"/>','<path d="M5 3h14v18l-7-4-7 4Z"/>','<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>','<circle cx="12" cy="12" r="9"/><path d="M12 3v9l7 5"/>'];
document.querySelectorAll('.mobile-nav a').forEach((a,i)=>{const span=a.querySelector('span');if(span)span.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">${icons[i]}</svg>`});
const menu=document.querySelector('.menu-toggle');if(menu){menu.onclick=()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');menu.textContent=open?'×':'☰';document.body.classList.toggle('header-menu-open',open)};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true')menu.click()})}
function setup(){
 const shelf=document.querySelector('#motionShelf');if(!shelf)return;
 const rounds=[1,3,8,9,11,15],works=rounds.map(r=>data.meetings.find(m=>m.round===r)),spines=['#a64b36','#9a2424','#d3d0b5','#2b3698','#70949a','#c2462e'];
 let index=0,paused=window.matchMedia('(prefers-reduced-motion: reduce)').matches,timer=null;
 shelf.innerHTML=works.map((m,i)=>`<button class="shelf-book ${i===0?'active':''}" style="--spine:${spines[i]};${i===2?'color:#171717':''}" data-index="${i}" aria-label="${esc(title(m))} 표지 펼치기" aria-pressed="${i===0}"><span class="book-volume"><span class="volume-pages"></span><span class="volume-front">${coverImage(title(m))}</span><span class="volume-spine">${esc(title(m))}</span></span></button>`).join('');
 const controls=document.querySelector('#shelfControls');controls.innerHTML=works.map((m,i)=>`<button data-index="${i}" aria-label="${esc(title(m))} 펼치기" class="${i===0?'active':''}" aria-pressed="${i===0}">${String(i+1).padStart(2,'0')}</button>`).join('');
 const caption=document.querySelector('#shelfTitle'),meta=document.querySelector('#shelfMeta'),link=document.querySelector('#shelfRead'),toggle=document.querySelector('#motionToggle');
 function select(i){index=(i+works.length)%works.length;shelf.querySelectorAll('button').forEach((b,n)=>{b.classList.toggle('active',n===index);b.setAttribute('aria-pressed',String(n===index))});controls.querySelectorAll('button').forEach((b,n)=>{b.classList.toggle('active',n===index);b.setAttribute('aria-pressed',String(n===index))});caption.textContent=title(works[index]);meta.textContent=`${String(works[index].round).padStart(2,'0')}회차 / ${name(recommender(works[index]))}의 추천`;link.setAttribute('aria-label',title(works[index])+' 모임 기록 보기')}
 function stop(){clearInterval(timer);timer=null}function start(){stop();if(!paused&&!document.hidden)timer=setInterval(()=>select(index+1),3600)}
 function choose(i){select(i);start()}
 shelf.querySelectorAll('button').forEach(b=>{b.onclick=()=>choose(+b.dataset.index);b.onpointerenter=e=>{if(e.pointerType==='mouse'){stop();select(+b.dataset.index)}};b.onfocus=()=>stop()});shelf.onpointerleave=()=>start();shelf.onfocusout=()=>start();
 controls.querySelectorAll('button').forEach(b=>b.onclick=()=>choose(+b.dataset.index));
 shelf.onkeydown=e=>{if(['ArrowRight','ArrowLeft'].includes(e.key)){e.preventDefault();choose(index+(e.key==='ArrowRight'?1:-1));shelf.querySelectorAll('button')[index].focus()}};
 link.onclick=e=>{e.preventDefault();stop();openMeeting(works[index].round)};
 function toggleText(){toggle.textContent=paused?'모션 재생 ▷':'모션 정지 Ⅱ';toggle.setAttribute('aria-pressed',String(!paused))}toggle.onclick=()=>{paused=!paused;document.body.classList.toggle('motion-enabled',!paused);toggleText();start()};toggleText();select(0);start();document.addEventListener('visibilitychange',start);document.querySelector('#detail').addEventListener('close',start);
 const stage=document.querySelector('.shelf-stage');if('IntersectionObserver' in window)new IntersectionObserver(entries=>{if(entries[0].isIntersecting)start();else stop()},{threshold:.15}).observe(stage);
 document.querySelectorAll('[data-home-round]').forEach(b=>b.onclick=e=>{e.preventDefault();openMeeting(+b.dataset.homeRound)});
 document.querySelector('#homeMeetings').textContent=completedMeetings().length;document.querySelector('#homeBooks').textContent=completedMeetings().filter(m=>m.round!==5).length;document.querySelector('#homeRecommendations').textContent=recommendationRows().length;
}
if(typeof data!=='undefined'&&data)setup();else window.addEventListener('records-ready',setup,{once:true});
})();
