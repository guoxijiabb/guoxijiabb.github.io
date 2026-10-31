(() => {
  const gallery = document.querySelector('.render-gallery');
  if (!gallery) return;
  const viewport = gallery.querySelector('.render-viewport');
  const slides = [...gallery.querySelectorAll('.render-slide')];
  const thumbs = [...gallery.querySelectorAll('.render-thumb')];
  const rail = gallery.querySelector('.render-thumbnails');
  const previous = gallery.querySelector('[data-action="prev"]');
  const next = gallery.querySelector('[data-action="next"]');
  const play = gallery.querySelector('[data-action="play"]');
  const count = gallery.querySelector('.render-count');
  const status = gallery.querySelector('.render-status');
  const original = gallery.querySelector('.render-original');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let index = 0;
  let direction = 1;
  let playing = !reduced.matches;
  let visible = false;
  let hovered = false;
  let focused = false;
  let timer;
  let frame;
  const position = (i) => slides[i].offsetLeft - slides[0].offsetLeft;

  function schedule() {
    clearTimeout(timer);
    if (playing && !reduced.matches && visible && !hovered && !focused && !document.hidden) {
      timer = setTimeout(() => {
        if (index === slides.length - 1) direction = -1;
        if (index === 0) direction = 1;
        go(index + direction, true, false);
        schedule();
      }, 6000);
    }
  }
  function updatePlayback() {
    play.textContent = reduced.matches ? '已减少动态效果' : playing ? '暂停自动播放' : '播放自动轮播';
    play.setAttribute('aria-label', play.textContent);
    play.setAttribute('aria-pressed', String(playing && !reduced.matches));
    play.disabled = reduced.matches;
    status.setAttribute('aria-live', playing ? 'off' : 'polite');
    schedule();
  }
  function pause() {
    playing = false;
    updatePlayback();
  }
  function select(i) {
    index = i;
    count.textContent = String(i + 1).padStart(2, '0') + ' / ' + slides.length;
    status.textContent = '当前第 ' + (i + 1) + ' 张，共 ' + slides.length + ' 张';
    original.href = slides[i].querySelector('a').href;
    original.setAttribute('aria-label', '查看第 ' + (i + 1) + ' 张高清原图');
    previous.disabled = i === 0;
    next.disabled = i === slides.length - 1;
    thumbs.forEach((thumb, n) => {
      if (n === i) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    });
    // Move only the thumbnail rail, never the document's vertical scroll.
    rail.scrollTo({ left: Math.max(0, thumbs[i].offsetLeft - rail.offsetLeft - rail.clientWidth / 2 + thumbs[i].clientWidth / 2), behavior: 'instant' });
    [i - 1, i, i + 1].filter(n => n >= 0 && n < slides.length).forEach(n => {
      slides[n].querySelector('img').loading = 'eager';
    });
  }
  function go(i, smooth = true, manual = true) {
    if (manual) pause();
    const target = Math.max(0, Math.min(slides.length - 1, i));
    viewport.scrollTo({ left: position(target), behavior: smooth && !reduced.matches ? 'smooth' : 'instant' });
  }
  previous.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  play.addEventListener('click', () => { playing = !playing; updatePlayback(); });
  thumbs.forEach((thumb, i) => thumb.addEventListener('click', () => go(i, false)));
  viewport.addEventListener('keydown', event => {
    const targets = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: slides.length - 1 };
    if (!(event.key in targets) || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    go(targets[event.key], false);
  });
  viewport.addEventListener('pointerdown', pause, { passive: true });
  viewport.addEventListener('wheel', event => {
    if (Math.abs(event.deltaX) > 0 || event.shiftKey) pause();
  }, { passive: true });
  viewport.addEventListener('scroll', () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      let nearest = 0, distance = Infinity;
      slides.forEach((_, i) => {
        const delta = Math.abs(position(i) - viewport.scrollLeft);
        if (delta < distance) { nearest = i; distance = delta; }
      });
      if (nearest !== index) select(nearest);
    });
  }, { passive: true });
  gallery.addEventListener('pointerenter', () => { hovered = finePointer.matches; schedule(); });
  gallery.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  gallery.addEventListener('focusin', () => { focused = true; schedule(); });
  gallery.addEventListener('focusout', event => {
    focused = gallery.contains(event.relatedTarget);
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => { playing = false; updatePlayback(); });
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    schedule();
  }, { threshold: 0.15 }).observe(viewport);
  new ResizeObserver(() => {
    viewport.scrollTo({ left: position(index), behavior: 'instant' });
  }).observe(viewport);
  select(0);
  updatePlayback();
})();
