(() => {
  const events = (window.UTEBO_EVENTS || []).map(e => ({...e, audience:e.audience||[]}));
  let audience = '', category = '', date = '', mode = 'all';
  const favorites = new Set(JSON.parse(localStorage.getItem('utebo-favorites') || '[]'));
  const list = document.querySelector('#eventsList');
  const count = document.querySelector('#resultCount');
  const search = document.querySelector('#searchInput');
  const dateFilters = document.querySelector('#dateFilters');
  const categoryFilters = document.querySelector('#categoryFilters');
  const empty = document.querySelector('#emptyState');
  const labels = {infantil:'Infantil',musica:'Música',tradicion:'Tradición',accesibilidad:'Accesible',taurino:'Taurino',espectaculo:'Espectáculo'};
  const fmtDate = d => new Intl.DateTimeFormat('es-ES',{weekday:'short',day:'numeric',month:'short'}).format(new Date(d+'T12:00:00'));
  function renderFilters(){
    const dates=[...new Set(events.map(e=>e.date))];
    dateFilters.innerHTML='<button class="is-active" data-date="">Todos</button>'+dates.map(d=>`<button data-date="${d}">${fmtDate(d)}</button>`).join('');
    const cats=[...new Set(events.map(e=>e.category))];
    categoryFilters.innerHTML='<button class="is-active" data-category="">Todas</button>'+cats.map(c=>`<button data-category="${c}">${labels[c]||c}</button>`).join('');
  }
  function filtered(){
    const q=(search.value||'').toLowerCase();
    return events.filter(e=>{
      const text=`${e.title} ${e.location} ${e.desc||''}`.toLowerCase();
      const modeOk=mode==='all'||mode==='family'?(mode!=='family'||!['taurino'].includes(e.category)):mode==='night'?(e.start>='20:00'):true;
      return (!audience||e.audience.includes(audience))&&(!category||e.category===category)&&(!date||e.date===date)&&(!q||text.includes(q))&&modeOk;
    }).sort((a,b)=>(a.date+a.start).localeCompare(b.date+b.start));
  }
  function render(){
    const data=filtered(); count.textContent=data.length; empty.hidden=!!data.length;
    list.innerHTML=data.map(e=>`<article class="event-card"><div class="event-meta">${fmtDate(e.date)} · ${e.timeTbd?'Horario no indicado':e.start}${e.end?'–'+e.end:''}</div><h3>${e.title}</h3><p>📍 ${e.location}</p>${e.desc?`<p>${e.desc}</p>`:''}<button class="button" data-fav="${e.id}">${favorites.has(e.id)?'★ Guardado':'☆ Guardar'}</button> <a class="button" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(e.location+', Utebo')}">Cómo llegar</a></article>`).join('');
  }
  document.addEventListener('click',ev=>{
    const d=ev.target.closest('[data-date]'); if(d){date=d.dataset.date; dateFilters.querySelectorAll('button').forEach(b=>b.classList.toggle('is-active',b===d)); render();}
    const c=ev.target.closest('[data-category]'); if(c){category=c.dataset.category; categoryFilters.querySelectorAll('button').forEach(b=>b.classList.toggle('is-active',b===c)); render();}
    const a=ev.target.closest('[data-audience]'); if(a){audience=a.dataset.audience; render(); document.querySelector('#programSection').scrollIntoView({behavior:'smooth'});}
    const q=ev.target.closest('[data-mode]'); if(q){mode=q.dataset.mode; document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('is-active',b===q)); render();}
    const f=ev.target.closest('[data-fav]'); if(f){favorites.has(f.dataset.fav)?favorites.delete(f.dataset.fav):favorites.add(f.dataset.fav);localStorage.setItem('utebo-favorites',JSON.stringify([...favorites]));render();}
  });
  search.addEventListener('input',render);
  document.querySelector('#resetAudienceButton').onclick=()=>{audience='';render()};
  document.querySelector('#clearFiltersButton').onclick=()=>{audience=category=date='';search.value='';renderFilters();render()};
  document.querySelector('#seeNowButton').onclick=()=>document.querySelector('#programSection').scrollIntoView({behavior:'smooth'});
  const announce=(window.UTEBO_ANNOUNCEMENTS||[]).find(a=>a.active); if(announce) document.querySelector('#announcementRegion').innerHTML=`<div class="announcement"><strong>${announce.title}</strong> · ${announce.message}</div>`;
  document.querySelector('#settingsButton').onclick=()=>document.querySelector('#settingsDialog').showModal();
  document.querySelector('#settingsDialog .dialog-close').onclick=()=>document.querySelector('#settingsDialog').close();
  document.querySelector('#largeTextToggle').onchange=e=>document.body.classList.toggle('large-text',e.target.checked);
  document.querySelector('#contrastToggle').onchange=e=>document.body.classList.toggle('high-contrast',e.target.checked);
  document.querySelector('#readPageButton').onclick=()=>speechSynthesis.speak(new SpeechSynthesisUtterance(`Utebo en Fiestas. Hay ${filtered().length} actividades visibles.`));
  document.querySelector('#qrButton').onclick=()=>{const dlg=document.querySelector('#qrDialog');document.querySelector('#qrUrl').textContent=location.href;dlg.showModal();};
  document.querySelector('#qrDialog .dialog-close').onclick=()=>document.querySelector('#qrDialog').close();
  document.querySelector('#copyLinkButton').onclick=()=>navigator.clipboard.writeText(location.href);
  if('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  renderFilters(); render();
})();
