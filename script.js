(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // loader -> ready
  const start=()=>{ $('#loader').classList.add('done'); document.body.classList.add('ready'); typeLoop(); };
  let started=false; const go=()=>{ if(!started){started=true; setTimeout(start,reduce?0:1400);} };
  window.addEventListener('load',go); setTimeout(go,3000);

  // typed roles
  const roles=['B.Tech AI Student','Python & C++ Programmer','Competitive Coding Aspirant','Logical Problem Solver'];
  const el=$('#typed'); let ri=0,ci=0,del=false;
  function typeLoop(){
    if(reduce){el.textContent=roles[0];return;}
    const word=roles[ri];
    el.textContent=word.slice(0,ci);
    if(!del&&ci<word.length){ci++;setTimeout(typeLoop,75);}
    else if(!del){del=true;setTimeout(typeLoop,1500);}
    else if(ci>0){ci--;setTimeout(typeLoop,38);}
    else{del=false;ri=(ri+1)%roles.length;setTimeout(typeLoop,300);}
  }

  // scroll progress + nav state + active link
  const nav=$('#nav'), prog=$('#progress');
  const secs=$$('main section[id]'), links=$$('#links a[href^="#"]');
  function onScroll(){
    const h=document.documentElement; const y=h.scrollTop;
    prog.style.width=(y/(h.scrollHeight-h.clientHeight)*100)+'%';
    nav.classList.toggle('scrolled',y>40);
    let cur=''; secs.forEach(s=>{ if(y>=s.offsetTop-160) cur=s.id; });
    links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur));
  }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  // mobile menu
  const burger=$('#burger'), menu=$('#links');
  burger.onclick=()=>{burger.classList.toggle('open');menu.classList.toggle('open');};
  $$('#links a').forEach(a=>a.addEventListener('click',()=>{burger.classList.remove('open');menu.classList.remove('open');}));

  // reveal on scroll (+ stagger, counters, bars, timeline)
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting) return;
    const t=e.target; io.unobserve(t);
    const sib=t.parentElement? [...t.parentElement.children].filter(c=>c.classList.contains('reveal')).indexOf(t):0;
    setTimeout(()=>{ t.classList.add('in');
      const c=$('[data-count]',t); if(c) count(c);
      $$('.bar',t).forEach(b=>b.classList.add('in'));
    }, reduce?0:Math.max(0,sib)*90);
  }),{threshold:.14,rootMargin:'0px 0px -40px 0px'});
  $$('.reveal').forEach(n=>io.observe(n));
  const tio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');tio.unobserve(e.target);}}),{threshold:.1});
  $$('.timeline').forEach(n=>tio.observe(n));
  $$('.skills-grid .card').forEach(c=>{ const b=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ $$('.bar',c).forEach(x=>x.classList.add('in')); b.disconnect(); }}),{threshold:.3}); b.observe(c); });

  function count(n){
    const to=+n.dataset.count, suf=n.dataset.suffix||''; if(reduce){n.textContent=to+suf;return;}
    const t0=performance.now(), d=1500;
    (function f(t){ const p=Math.min((t-t0)/d,1), e=1-Math.pow(1-p,3); n.textContent=Math.round(to*e)+suf; if(p<1) requestAnimationFrame(f); })(t0);
  }

  // cursor glow
  const glow=$('#glow');
  addEventListener('pointermove',e=>{ glow.style.left=e.clientX+'px'; glow.style.top=e.clientY+'px'; },{passive:true});

  // 3D tilt + spotlight on cards
  if(!reduce && matchMedia('(hover:hover)').matches){
    $$('.tilt').forEach(c=>{
      const m=+c.dataset.tilt||5;
      c.addEventListener('pointermove',e=>{
        const r=c.getBoundingClientRect(), x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
        c.style.transform=`perspective(900px) rotateX(${(.5-y)*m}deg) rotateY(${(x-.5)*m}deg)`;
        c.style.setProperty('--mx',x*100+'%'); c.style.setProperty('--my',y*100+'%');
      });
      c.addEventListener('pointerleave',()=>{ c.style.transform=''; });
    });
    // magnetic buttons
    $$('.magnetic').forEach(b=>{
      b.addEventListener('pointermove',e=>{ const r=b.getBoundingClientRect(); b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`; });
      b.addEventListener('pointerleave',()=>{ b.style.transform=''; });
    });
  }

  // contact form -> mailto
  $('#form').addEventListener('submit',e=>{
    e.preventDefault(); const f=new FormData(e.target);
    const body=`${f.get('msg')}\n\n— ${f.get('name')} (${f.get('email')})`;
    location.href=`mailto:rashiisaleem@gmail.com?subject=${encodeURIComponent('Portfolio message from '+f.get('name'))}&body=${encodeURIComponent(body)}`;
  });

  $('#year').textContent=new Date().getFullYear();
})();
