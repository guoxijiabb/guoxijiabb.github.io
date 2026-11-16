(() => {
  function init() {
    const root = document.querySelector('#ai-film-gallery');
    if (!root || root.dataset.ready) return;
    root.dataset.ready = 'true';

    const track = root.querySelector('.film-track');
    const cards = [...track.querySelectorAll('.film-card')];
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const toggle = root.querySelector('.film-auto');
    const preview = document.createElement('video');
    preview.muted = true;
    preview.defaultMuted = true;
    preview.loop = true;
    preview.playsInline = true;
    preview.preload = 'none';
    preview.setAttribute('aria-hidden', 'true');

    const stages = cards.map(card => {
      const stage = document.createElement('div');
      stage.className = 'film-media';
      const cover = card.querySelector('img');
      cover.before(stage);
      stage.append(cover);
      return stage;
    });

    let current = 0;
    let auto = !motion.matches;
    let visible = false;
    let pending = false;
    let timer;
    let frame;
    let pointer;
    let moved = false;

    const canPlay = () => auto && visible && !document.hidden && !pending && !moved;

    function syncPreview() {
      clearTimeout(timer);
      if (!canPlay()) {
        preview.pause();
        return;
      }
      if (preview.hasAttribute('src')) {
        preview.play().catch(() => {});
        return;
      }
      timer = setTimeout(() => {
        if (!canPlay()) return;
        preview.src = cards[current].dataset.preview;
        preview.play().catch(() => {});
      }, 2000);
    }

    function resetPreview() {
      preview.pause();
      preview.removeAttribute('src');
      preview.load();
      preview.remove();
      stages.forEach(stage => stage.classList.remove('has-preview'));
      stages[current].append(preview);
      syncPreview();
    }

    preview.addEventListener('playing', () => stages[current].classList.add('has-preview'));
    preview.addEventListener('error', () => stages[current].classList.remove('has-preview'));

    function update(index) {
      const changed = current !== index;
      current = index;
      const card = cards[index];
      cards.forEach((item, i) => {
        item.classList.toggle('is-current', i === index);
        if (i === index) item.setAttribute('aria-current', 'true');
        else item.removeAttribute('aria-current');
      });
      root.querySelector('.film-now').textContent = card.querySelector('h3').textContent;
      root.querySelector('.film-eyebrow').textContent = card.dataset.eyebrow;
      root.querySelector('.film-meta p:last-child').textContent = card.dataset.description;
      root.querySelector('.film-count').textContent = String(index + 1).padStart(2, '0') + ' / ' + String(cards.length).padStart(2, '0');
      if (changed) resetPreview();
    }

    function select(index, behavior = motion.matches ? 'instant' : 'smooth') {
      index = (index + cards.length) % cards.length;
      update(index);
      track.scrollTo({
        left: cards[index].offsetLeft - (track.clientWidth - cards[index].offsetWidth) / 2,
        behavior,
      });
    }

    track.addEventListener('scroll', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        const distance = card => Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
        const closest = cards.reduce((best, card) => distance(card) < distance(best) ? card : best);
        const index = cards.indexOf(closest);
        if (index !== current) update(index);
      });
    }, { passive: true });

    track.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      pointer = { x: event.clientX, start: track.scrollLeft, id: event.pointerId };
      moved = false;
    });
    track.addEventListener('pointermove', event => {
      if (!pointer) return;
      const dx = event.clientX - pointer.x;
      if (!moved && Math.abs(dx) > 7) {
        moved = true;
        track.classList.add('is-dragging');
        track.setPointerCapture(pointer.id);
        syncPreview();
      }
      if (moved) track.scrollLeft = pointer.start - dx;
    });
    function endDrag() {
      if (!pointer) return;
      pointer = null;
      track.classList.remove('is-dragging');
      if (!moved) return;
      select(current);
      setTimeout(() => {
        moved = false;
        syncPreview();
      }, 0);
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);

    cards.forEach((card, index) => {
      card.addEventListener('dragstart', event => event.preventDefault());
      card.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
        if (moved || pending) {
          event.preventDefault();
          return;
        }
        if (index !== current && event.detail !== 0) {
          event.preventDefault();
          select(index);
          return;
        }
        if (motion.matches) return;

        event.preventDefault();
        pending = true;
        syncPreview();
        const rect = card.getBoundingClientRect();
        const overlay = document.createElement('div');
        const image = new Image();
        overlay.className = 'film-transition';
        image.src = card.querySelector('img').src;
        image.style.cssText = `left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;object-fit:cover`;
        overlay.append(image);
        document.body.append(overlay);
        overlay.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, fill: 'both' });
        const scale = Math.max(innerWidth / rect.width, innerHeight / rect.height);
        image.animate([
          { transform: 'translate(0,0) scale(1)' },
          { transform: `translate(${(innerWidth - rect.width * scale) / 2 - rect.left}px,${(innerHeight - rect.height * scale) / 2 - rect.top}px) scale(${scale})` },
        ], { duration: 500, easing: 'cubic-bezier(.77,0,.175,1)', fill: 'forwards' });
        try { sessionStorage.setItem('film-entry', card.dataset.film || String(index)); } catch {}
        setTimeout(() => location.assign(card.href), 500);
      });
    });

    function label() {
      toggle.textContent = auto ? '暂停预览' : '播放预览';
      toggle.setAttribute('aria-label', auto ? '暂停卡片内视频预览' : '播放卡片内视频预览');
    }

    root.querySelector('.film-prev').onclick = () => select(current - 1);
    root.querySelector('.film-next').onclick = () => select(current + 1);
    toggle.onclick = () => {
      auto = !auto;
      label();
      syncPreview();
    };
    motion.addEventListener('change', event => {
      auto = !event.matches;
      label();
      syncPreview();
    });
    track.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      select(event.key === 'Home' ? 0 : event.key === 'End' ? cards.length - 1 : current + (event.key === 'ArrowRight' ? 1 : -1));
    });
    document.addEventListener('visibilitychange', syncPreview);
    new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= 0.35;
      syncPreview();
    }, { threshold: 0.35 }).observe(track);
    window.addEventListener('pageshow', () => {
      pending = false;
      document.querySelectorAll('.film-transition').forEach(node => node.remove());
      syncPreview();
    });
    new ResizeObserver(() => {
      if (!pointer) select(current, 'instant');
    }).observe(track);

    label();
    update(0);
    resetPreview();
  }

  new MutationObserver(init).observe(document.body, { childList: true, subtree: true });
  init();
})();
