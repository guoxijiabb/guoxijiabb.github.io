(() => {
 function init() {
  const el = document.querySelector('#ai-cinema');
  if (!el || el.dataset.ready) return;
  el.dataset.ready = 'true';
  const q = s => el.querySelector(s), video = q('video'), screen = q('.cinema-screen');
  const seasons = ['元宵','春节','端午','五一'];
  let project = 0, version = 0, auto = !matchMedia('(prefers-reduced-motion:reduce)').matches, visible = false, hovering = false, timer, pointer;
  function schedule() {
   clearTimeout(timer);
   if (auto && visible && !hovering && !document.hidden && !el.contains(document.activeElement)) timer = setTimeout(() => select(project + 1),12000);
  }
  function play() { if (visible && project && !document.hidden) video.play().catch(() => {}); }
  function season(i) {
   version = i;
   const base = '/assets/ai-video/tmall-opening/kv-' + String(i+1).padStart(2,'0');
   video.src = base + '.mp4'; video.poster = base + '.jpg'; video.muted = true; video.loop = true; play();
   q('.cinema-media-note').textContent = seasons[i] + ' / 静音循环播放，可开启声音';
   el.querySelectorAll('[data-version]').forEach(b => b.setAttribute('aria-pressed',String(Number(b.dataset.version)===i)));
  }
  function select(i) {
   project = (i+2)%2; video.pause();
   q('.cinema-still').hidden = !!project; video.hidden = !project;
   q('.cinema-versions').hidden = !project; q('.cinema-detail').hidden = !project;
   const title = project ? '天猫超市 · 手机开屏 KV' : '轮回千年';
   q('.cinema-title').textContent = title; q('.cinema-now').textContent = title;
   q('.cinema-counter').textContent = String(project+1).padStart(2,'0')+' / 02';
   q('.cinema-kicker').textContent = project ? 'TMALL MART / MOBILE OPENING KV' : 'AI SHORT FILM';
   q('.cinema-description').textContent = project ? '以天猫形象串联元宵、春节、端午与五一，呈现四组手机开屏的节日动态视觉。选择下方节日，在银幕中查看对应视频。' : '古装人物对峙与战场氛围，构成《轮回千年》的封面视觉。';
   q('.cinema-media-note').textContent = '封面视觉';
   el.querySelectorAll('[data-project]').forEach(b => b.setAttribute('aria-pressed',String(Number(b.dataset.project)===project)));
   if (project) season(version); schedule();
  }
  q('.cinema-prev').onclick = () => select(project-1);
  q('.cinema-next').onclick = () => select(project+1);
  el.querySelectorAll('[data-project]').forEach(b => b.onclick = () => select(Number(b.dataset.project)));
  el.querySelectorAll('[data-version]').forEach(b => b.onclick = () => { season(Number(b.dataset.version)); schedule(); });
  q('.cinema-auto').onclick = () => { auto = !auto; q('.cinema-auto').textContent = auto ? '暂停轮播' : '自动轮播'; q('.cinema-auto').setAttribute('aria-label',auto?'暂停项目自动轮播':'开启项目自动轮播'); schedule(); };
  if (!auto) q('.cinema-auto').textContent = '自动轮播';
  screen.addEventListener('keydown', e => { if(e.target===screen && ['ArrowLeft','ArrowRight'].includes(e.key)) { e.preventDefault(); select(project+(e.key==='ArrowRight'?1:-1)); } });
  screen.addEventListener('pointerdown', e => { if(e.target===video && e.clientY>video.getBoundingClientRect().bottom-50)return; pointer={x:e.clientX,y:e.clientY}; if(e.target!==video)screen.setPointerCapture(e.pointerId); });
  screen.addEventListener('pointerup', e => { if(!pointer)return; const dx=e.clientX-pointer.x; if(Math.abs(dx)>45 && Math.abs(dx)>Math.abs(e.clientY-pointer.y))select(project+(dx<0?1:-1)); pointer=null; });
  screen.addEventListener('pointercancel',()=>{pointer=null;});
  q('.cinema-still').draggable=false;
  el.addEventListener('pointerenter', e => { if(e.pointerType==='mouse')hovering=true; schedule(); });
  el.addEventListener('pointerleave',()=>{hovering=false;schedule();});
  el.addEventListener('focusin',schedule); el.addEventListener('focusout',()=>setTimeout(schedule,0));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else play();schedule();});
  new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(!visible)video.pause();else play();schedule();},{threshold:.2}).observe(el);
  select(1);
 }
 new MutationObserver(init).observe(document.body,{childList:true,subtree:true}); init();
})();
