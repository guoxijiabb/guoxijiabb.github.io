(() => {
  function init() {
    const root = document.querySelector('#ai-film-gallery');
    if (!root || root.dataset.ready) return;
    root.dataset.ready = 'true';

    const track = root.querySelector('.film-track');
    const originals = [...track.querySelectorAll('.film-card')];
    const count = originals.length;

    function copyCard(card) {
      const copy = card.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.removeAttribute('aria-current');
      copy.classList.remove('is-current');
      copy.tabIndex = -1;
      copy.querySelector('img').loading = 'lazy';
      return copy;
    }

    const leading = originals.map(copyCard);
    const trailing = originals.map(copyCard);
    track.prepend(...leading);
    track.append(...trailing);
    const cards = [...leading, ...originals, ...trailing];
    const logicalIndex = position => position % count;
    const center = card => card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2;
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

    let current = count;
    let auto = !motion.matches;
    let visible = false;
    let pending = false;
    let timer;
    let rotationTimer;
    let settleTimer;
    let frame;
    let pressed = false;
    let pointer;
    let moved = false;

    const canPlay = () => auto && visible && !document.hidden && !pending && !pressed && !moved;

    const canRotate = () => canPlay() && !track.querySelector(':focus-visible') && !track.matches(':focus-visible');

    function syncRotation() {
      clearTimeout(rotationTimer);
      if (!canRotate()) return;
      rotationTimer = setTimeout(() => {
        if (canRotate()) select(current + 1);
      }, 7000);
    }

    function syncPlayback() {
      syncPreview();
      syncRotation();
    }

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
      syncPlayback();
    }

    preview.addEventListener('playing', () => stages[current].classList.add('has-preview'));
    preview.addEventListener('error', () => stages[current].classList.remove('has-preview'));

    function update(index) {
      const changed = current !== index;
      current = index;
      const card = cards[index];
      cards.forEach((item, i) => item.classList.toggle('is-current', i === index));
      originals.forEach((item, i) => {
        if (i === logicalIndex(index)) item.setAttribute('aria-current', 'true');
        else item.removeAttribute('aria-current');
      });
      root.querySelector('.film-now').textContent = card.querySelector('h3').textContent;
      root.querySelector('.film-eyebrow').textContent = card.dataset.eyebrow;
      root.querySelector('.film-meta p:last-child').textContent = card.dataset.description;
      root.querySelector('.film-count').textContent = String(logicalIndex(index) + 1).padStart(2, '0') + ' / ' + String(count).padStart(2, '0');
      if (changed) resetPreview();
    }

    function select(index, behavior = motion.matches ? 'instant' : 'smooth') {
      clearTimeout(rotationTimer);
      index = (index + cards.length) % cards.length;
      track.scrollTo({ left: center(cards[index]), behavior });
      if (behavior === 'instant') update(index);
      if (behavior === 'smooth') {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(settle, 180);
      }
    }

    function nearestPosition() {
      const left = track.scrollLeft;
      return cards.reduce((closest, card, index) =>
        Math.abs(center(card) - left) < Math.abs(center(cards[closest]) - left) ? index : closest, current);
    }

    function settle() {
      if (pressed || moved || pending) return;
      const index = nearestPosition();
      const middle = count + logicalIndex(index);
      if (index !== middle) {
        track.classList.add('is-recentering');
        select(middle, 'instant');
        // Apply the matching card's final appearance before restoring transitions.
        cards[middle].getBoundingClientRect();
        track.classList.remove('is-recentering');
      } else if (index !== current) {
        update(index);
      }
      syncPlayback();
    }

    track.addEventListener('scroll', () => {
      clearTimeout(rotationTimer);
      clearTimeout(settleTimer);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const index = nearestPosition();
        if (index !== current) update(index);
      });
      settleTimer = setTimeout(settle, 180);
    }, { passive: true });

    track.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0) return;
      pressed = true;
      if (event.pointerType === 'mouse') {
        pointer = { x: event.clientX, start: track.scrollLeft, id: event.pointerId };
      }
      moved = false;
      syncPlayback();
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
    function endDrag(event) {
      if (!pressed || !event.isPrimary) return;
      pressed = false;
      pointer = null;
      track.classList.remove('is-dragging');
      if (!moved) {
        clearTimeout(settleTimer);
        settleTimer = setTimeout(settle, 180);
        return;
      }
      select(nearestPosition());
      setTimeout(() => {
        moved = false;
        clearTimeout(settleTimer);
        settleTimer = setTimeout(settle, 180);
      }, 0);
    }
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

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
        syncPlayback();
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
        try { sessionStorage.setItem('film-entry', card.dataset.film || String(logicalIndex(index))); } catch {}
        setTimeout(() => location.assign(card.href), 500);
      });
    });

    function label() {
      toggle.textContent = auto ? '暂停轮播' : '继续轮播';
      toggle.setAttribute('aria-label', auto ? '暂停胶卷轮播与视频预览' : '继续胶卷轮播与视频预览');
    }

    root.querySelector('.film-prev').onclick = () => select(current - 1);
    root.querySelector('.film-next').onclick = () => select(current + 1);
    toggle.onclick = () => {
      auto = !auto;
      label();
      syncPlayback();
    };
    motion.addEventListener('change', event => {
      auto = !event.matches;
      label();
      syncPlayback();
    });
    track.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      select(event.key === 'Home' ? count : event.key === 'End' ? 2 * count - 1 : current + (event.key === 'ArrowRight' ? 1 : -1));
    });
    track.addEventListener('focusin', syncRotation);
    track.addEventListener('focusout', () => queueMicrotask(syncRotation));
    document.addEventListener('visibilitychange', syncPlayback);
    new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= 0.35;
      syncPlayback();
    }, { threshold: 0.35 }).observe(track);
    window.addEventListener('pageshow', () => {
      pending = false;
      document.querySelectorAll('.film-transition').forEach(node => node.remove());
      syncPlayback();
    });
    new ResizeObserver(() => {
      if (!pressed) {
        select(count + logicalIndex(current), 'instant');
        syncPlayback();
      }
    }).observe(track);

    root.querySelector('.film-hint').textContent = '胶卷自动向左轮播 · 可拖动浏览 · 点击居中卡片观看正片';
    label();
    select(count, 'instant');
    resetPreview();
  }

  new MutationObserver(init).observe(document.body, { childList: true, subtree: true });
  init();
})();
