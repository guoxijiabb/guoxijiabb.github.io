/* Paper folding: StPageFlip 2.0.7 (MIT), https://github.com/Nodlik/StPageFlip
 * Vendored locally in ../vendor/page-flip; artwork always comes from the original gallery.
 * No autoplay: the reader only moves in response to deliberate input. */
(() => {
  const reader = document.querySelector('.catalog-reader');
  const gallery = document.querySelector('.catalog-grid');
  const root = document.querySelector('.catalog-book');
  if (!reader || !gallery || !root || !window.St?.PageFlip) return;
  const sheets = [...gallery.querySelectorAll('.catalog-sheet')];
  const total = sheets.length;
  const stage = reader.querySelector('.book-stage');
  const mount = reader.querySelector('.book-mount');
  const bookView = reader.querySelector('.reader-book-view');
  const prev = reader.querySelector('.reader-prev');
  const next = reader.querySelector('.reader-next');
  const nav = [...document.querySelectorAll('.catalog-page-nav a')];
  const counter = reader.querySelector('.reader-counter');
  const position = reader.querySelector('.reader-position');
  const links = reader.querySelector('.reader-page-links');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const number = n => String(n + 1).padStart(2, '0');
  let mode = 'book';
  let gesture = null;
  let api;
  let resizeFrame;

  reader.hidden = false;
  gallery.hidden = true;
  root.replaceChildren();
  sheets.forEach((sheet, index) => {
    const page = document.createElement('div');
    page.className = 'book-page';
    page.dataset.page = index + 1;
    page.setAttribute('aria-label', `原图册第 ${index + 1} 页`);
    const image = sheet.querySelector('img').cloneNode();
    image.loading = 'eager';
    image.draggable = false;
    page.append(image);
    root.append(page);
  });

  function fit() {
    if (mode !== 'book') return;
    const width = mount.clientWidth;
    const portrait = width < 640;
    const naturalHeight = width / (portrait ? 1 : 2) * 1800 / 1273;
    const availableHeight = Math.max(320, Math.min(700, window.innerHeight - 210));
    mount.style.height = Math.floor(Math.min(naturalHeight, availableHeight)) + 'px';
    if (api) { api.getRender().finishAnimation(); api.update(); sync(); }
  }
  fit();

  api = new St.PageFlip(root, {
    width: 400, height: 400 * 1800 / 1273,
    size: 'stretch', minWidth: 320, maxWidth: 500, minHeight: 100, maxHeight: 710,
    autoSize: false, usePortrait: true, showCover: false,
    drawShadow: true, maxShadowOpacity: 0.28, flippingTime: 650,
    useMouseEvents: false, showPageCorners: false, mobileScrollSupport: true,
  });

  function indices() {
    const first = Math.max(0, Math.min(total - 1, api.getCurrentPageIndex()));
    return api.getOrientation() === 'landscape' && first + 1 < total ? [first, first + 1] : [first];
  }
  function sync() {
    if (!api || !api.getPageCount()) return;
    const shown = indices();
    const first = shown[0];
    const last = shown[shown.length - 1];
    counter.textContent = shown.map(number).join(' — ') + ' / ' + total;
    position.textContent = (api.getOrientation() === 'landscape' ? '双页阅读' : '单页阅读') + (last === total - 1 ? ' · 已到末页' : '');
    reader.querySelector('.reader-track span').style.transform = `scaleX(${(last + 1) / total})`;
    const turning = stage.dataset.state === 'flipping';
    prev.disabled = first === 0 && !turning;
    next.disabled = last === total - 1 && !turning;
    stage.dataset.orientation = api.getOrientation();
    reader.dataset.currentPage = first + 1;
    nav.forEach((link, i) => {
      if (shown.includes(i)) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    links.replaceChildren(...shown.map(i => {
      const anchor = document.createElement('a');
      anchor.href = sheets[i].querySelector('.board').href;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.textContent = `第 ${number(i)} 页 · 查看高清 ↗`;
      return anchor;
    }));
    root.querySelectorAll('.book-page').forEach(page => page.setAttribute('aria-hidden', String(!shown.includes(Number(page.dataset.page) - 1))));
  }

  // Public renderer API completes a pending turn before a new command: rapid input is never locked out.
  function go(index, instant = false) {
    api.getRender().finishAnimation();
    const target = Math.max(0, Math.min(total - 1, index));
    if (instant || reduced.matches) api.turnToPage(target);
    else if (!indices().includes(target)) api.flip(target, 'bottom');
    sync();
  }
  function step(direction, instant = false) {
    api.getRender().finishAnimation();
    const shown = indices();
    if (direction > 0 && shown.at(-1) < total - 1) go(shown.at(-1) + 1, instant);
    else if (direction < 0 && shown[0] > 0) go(shown[0] - 1, instant);
  }
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  api.on('init', sync);
  api.on('flip', sync);
  api.on('changeOrientation', () => requestAnimationFrame(sync));
  api.on('changeState', e => { stage.dataset.state = e.data; sync(); });
  api.loadFromHTML([...root.children]);
  sync();

  function setMode(nextMode) {
    api.getRender().finishAnimation();
    mode = nextMode;
    gallery.hidden = mode === 'book';
    bookView.hidden = mode === 'grid';
    reader.querySelectorAll('[data-reader-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.readerMode === mode)));
    if (mode === 'book') fit();
  }
  reader.querySelectorAll('[data-reader-mode]').forEach(button => button.addEventListener('click', () => setMode(button.dataset.readerMode)));
  nav.forEach((link, index) => link.addEventListener('click', event => {
    if (mode === 'grid') return;
    event.preventDefault();
    go(index, event.detail === 0);
    history.replaceState(null, '', link.hash);
    stage.scrollIntoView({behavior: 'instant', block: 'start'});
  }));
  function restoreHash() {
    const match = location.hash.match(/^#page-(\d+)$/);
    if (match && mode === 'book') { go(Number(match[1]) - 1, true); stage.scrollIntoView({behavior: 'instant', block: 'start'}); }
  }
  window.addEventListener('hashchange', restoreHash);
  restoreHash();

  reader.addEventListener('keydown', event => {
    if (event.target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || mode !== 'book' || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); step(1, true); }
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); step(-1, true); }
    if (event.key === 'Home') { event.preventDefault(); go(0, true); }
    if (event.key === 'End') { event.preventDefault(); go(total - 1, true); }
  });

  const surface = root.querySelector('.stf__block');
  function point(event) {
    const rect = surface.getBoundingClientRect();
    return {x: (event.clientX - rect.left) * surface.offsetWidth / rect.width, y: (event.clientY - rect.top) * surface.offsetHeight / rect.height};
  }
  // Pointer capture keeps the fold attached to the hand; pan-y leaves vertical page scrolling native.
  surface.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || document.body.classList.contains('is-editing')) return;
    api.getRender().finishAnimation();
    gesture = {id: event.pointerId, start: point(event), current: point(event), dragging: false, cancelled: false, samples: [{x: point(event).x, time: event.timeStamp}]};
    surface.setPointerCapture(event.pointerId);
  });
  surface.addEventListener('pointermove', event => {
    if (!gesture || event.pointerId !== gesture.id) return;
    const current = point(event);
    const dx = current.x - gesture.start.x;
    const dy = current.y - gesture.start.y;
    if (!gesture.dragging && Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { gesture.cancelled = true; return; }
    if (gesture.cancelled) return;
    if (!gesture.dragging && Math.abs(dx) > 10) {
      gesture.dragging = true;
      if (!reduced.matches) {
        api.startUserTouch(gesture.start);
        api.userMove({x: gesture.start.x + Math.sign(dx) * 7, y: gesture.start.y}, true);
      }
    }
    gesture.current = current;
    gesture.samples.push({x: current.x, time: event.timeStamp});
    gesture.samples = gesture.samples.filter(sample => event.timeStamp - sample.time < 100);
    if (gesture.dragging && !reduced.matches) { event.preventDefault(); api.userMove(current, true); }
  });
  // Small adapter for the pinned 2.0.7 engine: settle from the current paper fold,
  // rather than restarting a click animation. A deliberate flick or 34% drag commits.
  function settleFold(finished, cancel = false) {
    const controller = api.getFlipController();
    const calculation = controller.getCalculation();
    api.userStop(finished.current, true);
    if (!calculation) return;
    const sign = calculation.getDirection() === 0 ? -1 : 1;
    const travel = (finished.current.x - finished.start.x) * sign;
    const samples = finished.samples;
    const first = samples[0];
    const last = samples.at(-1);
    const velocity = first && last && last.time > first.time ? (last.x - first.x) / (last.time - first.time) * sign : 0;
    const bounds = api.getBoundsRect();
    const commit = !cancel && velocity > -0.25 && (travel > bounds.pageWidth * 0.34 || velocity > 0.45);
    controller.setState('flipping');
    controller.animateFlippingTo(calculation.getPosition(), {x: commit ? -bounds.pageWidth : bounds.pageWidth, y: calculation.getCorner() === 'bottom' ? bounds.height : 0}, commit);
  }
  function release(event) {
    if (!gesture || event.pointerId !== gesture.id) return;
    const finished = gesture;
    gesture = null;
    if (surface.hasPointerCapture(event.pointerId)) surface.releasePointerCapture(event.pointerId);
    if (event.type === 'pointercancel' || finished.cancelled) {
      if (finished.dragging && !reduced.matches) settleFold(finished, true);
      return;
    }
    if (finished.dragging) {
      if (reduced.matches) step(finished.current.x < finished.start.x ? 1 : -1, true);
      else settleFold(finished);
    } else {
      const bounds = api.getBoundsRect();
      const middle = api.getOrientation() === 'portrait' ? bounds.left + bounds.pageWidth * 1.5 : bounds.left + bounds.pageWidth;
      step(finished.start.x < middle ? -1 : 1);
    }
  }
  surface.addEventListener('pointerup', release);
  surface.addEventListener('pointercancel', release);
  surface.addEventListener('dragstart', event => event.preventDefault());
  // Hover is a hint, not an unsolicited turn; never enabled on touch or reduced motion.
  surface.addEventListener('pointermove', event => {
    if (!gesture && fine.matches && !reduced.matches && event.pointerType === 'mouse') {
      api.getSettings().showPageCorners = true;
      api.userMove(point(event), false);
    }
  });
  surface.addEventListener('pointerleave', () => {
    if (!gesture && api.getState() === 'fold_corner') api.userMove({x: -100, y: -100}, false);
  });
  reduced.addEventListener('change', () => { api.getRender().finishAnimation(); api.getSettings().showPageCorners = !reduced.matches && fine.matches; sync(); });
  new ResizeObserver(() => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(fit); }).observe(stage);
  window.addEventListener('resize', () => { cancelAnimationFrame(resizeFrame); resizeFrame = requestAnimationFrame(fit); });
  document.querySelector('.edit-toggle')?.addEventListener('click', () => { if (document.body.classList.contains('is-editing')) setMode('grid'); });
})();
