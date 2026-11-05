(() => {
 function init(){
 const el=document.querySelector('#ai-cinema');if(!el||el.dataset.ready)return;el.dataset.ready='true';
 const q=s=>el.querySelector(s),video=q('video'),screen=q('.cinema-screen'),seasons=['元宵','春节','端午','五一'];
 let version=0,auto=!matchMedia('(prefers-reduced-motion:reduce)').matches,visible=false,hovering=false,timer,pointer;
 function schedule(){clearTimeout(timer);if(auto&&visible&&!hovering&&!document.hidden&&!el.contains(document.activeElement))timer=setTimeout(()=>season(version+1),12000);}
 function play(){if(visible&&!document.hidden)video.play().catch(()=>{});}
 function season(i){version=(i+4)%4;const base='/assets/ai-video/tmall-opening/kv-'+String(version+1).padStart(2,'0');video.src=base+'.mp4';video.poster=base+'.jpg';video.muted=true;video.loop=true;video.hidden=false;play();q('.cinema-media-note').textContent=seasons[version]+' / 静音循环播放，可开启声音';el.querySelectorAll('[data-version]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.version)===version)));schedule();}
 q('.cinema-prev').onclick=()=>season(version-1);q('.cinema-next').onclick=()=>season(version+1);
 el.querySelectorAll('[data-project]').forEach(b=>b.onclick=()=>season(0));
 el.querySelectorAll('[data-version]').forEach(b=>b.onclick=()=>season(Number(b.dataset.version)));
 q('.cinema-auto').onclick=()=>{auto=!auto;q('.cinema-auto').textContent=auto?'暂停轮播':'自动轮播';q('.cinema-auto').setAttribute('aria-label',auto?'暂停节日版本自动轮播':'开启节日版本自动轮播');schedule();};if(!auto)q('.cinema-auto').textContent='自动轮播';
 screen.addEventListener('keydown',e=>{if(e.target===screen&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();season(version+(e.key==='ArrowRight'?1:-1));}});
 screen.addEventListener('pointerdown',e=>{if(e.target===video&&e.clientY>video.getBoundingClientRect().bottom-50)return;pointer={x:e.clientX,y:e.clientY};if(e.target!==video)screen.setPointerCapture(e.pointerId);});
 screen.addEventListener('pointerup',e=>{if(!pointer)return;const dx=e.clientX-pointer.x;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(e.clientY-pointer.y))season(version+(dx<0?1:-1));pointer=null;});screen.addEventListener('pointercancel',()=>pointer=null);
 el.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')hovering=true;schedule();});el.addEventListener('pointerleave',()=>{hovering=false;schedule();});el.addEventListener('focusin',schedule);el.addEventListener('focusout',()=>setTimeout(schedule,0));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else play();schedule();});new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)play();else video.pause();schedule();},{threshold:.2}).observe(el);season(0);
 }
 new MutationObserver(init).observe(document.body,{childList:true,subtree:true});init();
})();
