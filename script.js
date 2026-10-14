// Плавное появление блоков при прокрутке
const revealObserver=new IntersectionObserver((entries)=>entries.forEach((entry)=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i%5*70,280)}ms`;revealObserver.observe(el)});

// Кастомный курсор (только если он есть в разметке)
const cursor=document.querySelector('.cursor'),dot=document.querySelector('.cursor-dot');
if(cursor&&dot){
  window.addEventListener('mousemove',e=>{cursor.style.transform=`translate(${e.clientX-18}px,${e.clientY-18}px)`;dot.style.transform=`translate(${e.clientX-3}px,${e.clientY-3}px)`});
  document.querySelectorAll('a,button').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('hover'));el.addEventListener('mouseleave',()=>cursor.classList.remove('hover'))});
}

// Магнитный эффект для кнопок
document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();el.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.12}px,${(e.clientY-r.top-r.height/2)*.12}px)`});el.addEventListener('mouseleave',()=>el.style.transform='')});

// Мобильное меню (без накопления инлайн-стилей, закрытие по клику и Escape)
const nav=document.querySelector('.nav'),menuBtn=document.querySelector('.menu');
const setMenu=open=>{nav.classList.toggle('open',open);menuBtn.setAttribute('aria-expanded',String(open));menuBtn.textContent=open?'✕':'☰'};
if(nav&&menuBtn){
  menuBtn.addEventListener('click',()=>setMenu(!nav.classList.contains('open')));
  document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('click',e=>{if(!nav.contains(e.target))setMenu(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
  window.addEventListener('resize',()=>{if(window.innerWidth>800)setMenu(false)});
}

// Фильтры в портфолио
const filterBtns=document.querySelectorAll('.filters button'),cards=document.querySelectorAll('.work-card');
filterBtns.forEach(btn=>btn.addEventListener('click',()=>{
  filterBtns.forEach(b=>b.classList.remove('active'));btn.classList.add('active');
  const cat=btn.dataset.cat;cards.forEach(card=>card.classList.toggle('hide',cat!=='all'&&card.dataset.cat!==cat));
}));

// Модальное окно шоурила (заглушка: позже сюда можно вставить своё видео)
const modal=document.getElementById('showreel-modal'),playBtn=document.querySelector('.play');
if(modal&&playBtn){
  const openModal=()=>{modal.hidden=false;requestAnimationFrame(()=>modal.classList.add('open'));document.body.style.overflow='hidden'};
  const closeModal=()=>{modal.classList.remove('open');modal.hidden=true;document.body.style.overflow=''};
  playBtn.addEventListener('click',openModal);
  modal.querySelector('.modal-close').addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
  modal.querySelectorAll('a[href="#contact"]').forEach(a=>a.addEventListener('click',closeModal));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal()});
}

// Форма заявки: письмо уходит напрямую на вашу почту через FormSubmit (без открытия почтового приложения)
const form=document.querySelector('.contact-form');
if(form){
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(!form.checkValidity()){form.reportValidity();return}
    form.querySelector('.form-note').textContent='Спасибо! Заявка отправлена — отвечу в течение рабочего дня.';
    form.submit();
    form.reset();
  });
}

// Видео в услугах: играют, пока видны на экране; клик — пауза/пуск
const serviceVideos=document.querySelectorAll('.service-video');
if(serviceVideos.length){
  if('IntersectionObserver' in window){
    const videoObserver=new IntersectionObserver(entries=>entries.forEach(en=>{
      if(en.isIntersecting){en.target.play().catch(()=>{})}else{en.target.pause()}
    }),{threshold:.3});
    serviceVideos.forEach(v=>{videoObserver.observe(v);v.addEventListener('click',()=>{v.paused?v.play().catch(()=>{}):v.pause()})});
  }else{
    serviceVideos.forEach(v=>{v.controls=true});
  }
}

// Актуальный год в подвале
const year=document.getElementById('year');
if(year)year.textContent=new Date().getFullYear();

// Бесшовная бегущая строка: текста всегда хватает на два экрана (без пустого участка)
const marquee=document.querySelector('.marquee div');
if(marquee){
  const fit=()=>{
    const vw=document.documentElement.clientWidth||window.innerWidth;
    let w=marquee.scrollWidth||marquee.offsetWidth,guard=0;
    while(w>0&&w/2<vw&&guard++<12){marquee.innerHTML+=marquee.innerHTML;w=marquee.scrollWidth||marquee.offsetWidth}
    if(w>0)marquee.style.animationDuration=Math.max(12,Math.round(w/2/80))+'s';
  };
  fit();window.addEventListener('resize',fit);
}
