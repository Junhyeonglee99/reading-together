(()=>{
function renderJourney(){
 const target=document.querySelector('#bookshelfCards');if(!target)return;
 const pin='<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></svg>';
 target.innerHTML=[...data.meetings].sort((a,b)=>a.round-b.round).map(m=>{
 const t=title(m),c=coverInfo(t),image=c?`<img class="journey-cover-image" src="${esc(c.embedded||c.url)}" alt="${esc(t)} ${m.round===5?'포스터':'표지'}" loading="lazy">`:`<span class="journey-cover-missing">${esc(t)}</span>`,names=people(m),round=String(m.round).padStart(2,'0');
 if(m.status==='planned')return `<button class="journey-card journey-next" data-round="${m.round}" aria-label="${round}회차 ${esc(t)} 다음 모임 기록">${image}<div><span class="journey-next-label">NEXT CHAPTER / ${round}</span><h3>${esc(t)}</h3><p>${esc(name(recommender(m)))}의 추천<br>날짜 · 참석자 미정</p></div><span class="journey-arrow" aria-hidden="true">↗</span></button>`;
 return `<button class="journey-card" data-round="${m.round}" aria-label="${round}회차 ${esc(t)} 모임 기록"><div class="journey-art"><span class="journey-art-label">${m.round===1?'THE FIRST CHAPTER':'OUR DAYS TOGETHER'}</span><span class="journey-round" aria-hidden="true">${round}</span>${image}<span class="journey-art-end">JAdU / CHAPTER ${round}</span></div><div class="journey-date-row"><span>CHAPTER ${round}</span><span>${meetingDate(m)} · ${m.meeting_date?'개최일':'기록일'}</span></div><h3>${esc(t)}</h3><div class="journey-card-footer"><div><span class="journey-place">${pin}${esc(m.location||'장소 기록 없음')}</span><span class="journey-attendees">${names.map(esc).join(' · ')}${names.length?' / '+names.length+'명':'참석자 기록 없음'}</span></div><span class="journey-arrow" aria-hidden="true">↗</span></div></button>`;
 }).join('');target.querySelectorAll('[data-round]').forEach(b=>b.onclick=()=>openMeeting(+b.dataset.round));
}
if(typeof data!=='undefined'&&data)renderJourney();else window.addEventListener('records-ready',renderJourney,{once:true});
})();
