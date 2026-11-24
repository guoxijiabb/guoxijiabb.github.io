/* Shared, accessible preview for every poster card. */
(() => {
  const dialog = document.createElement('dialog');
  dialog.id = 'poster-preview';
  dialog.className = 'poster-gallery';
  dialog.setAttribute('aria-labelledby', 'poster-gallery-title');
  dialog.innerHTML = `
    <header class="poster-gallery__header">
      <h2 id="poster-gallery-title"></h2>
      <button class="poster-gallery__close" type="button" autofocus aria-label="关闭海报预览">
        关闭 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
      </button>
    </header>
    <div class="poster-gallery__pair"></div>`;
  document.body.append(dialog);
  const title = dialog.querySelector('h2');
  const gallery = dialog.querySelector('.poster-gallery__pair');
  let trigger;
  let backdropStart = false;
  const close = () => dialog.close();
  dialog.querySelector('button').addEventListener('click', close);
  const outside = event => {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  dialog.addEventListener('pointerdown', event => { backdropStart = outside(event); });
  dialog.addEventListener('click', event => { if (backdropStart && outside(event)) close(); });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('poster-gallery-open');
    trigger?.focus({ preventScroll: true });
  });

  function postersFor(card, cover) {
    const isRuxuan = cover.src.includes('ruxuan-signage');
    const isOishi = cover.src.includes('shrimp-flakes-product');
    const isMovement = cover.src.includes('100-days-keep-moving');
    const isOlakala = cover.src.includes('olakala-neighbours-cherries-floating');
    return isRuxuan ? [
      { src: '/assets/posters/ruxuan-signage.jpg', width: 1772, height: 2364, alt: '如轩餐饮视觉：店铺招牌设计与六款砂锅粥产品海报' },
      { src: '/assets/posters/ruxuan-takeaway.jpg', width: 1773, height: 2364, alt: '如轩餐饮视觉：外卖小程序点餐、会员中心与确认订单界面' },
    ] : isMovement ? [
      { src: '/assets/posters/100-days-keep-moving.png', width: 941, height: 1672, alt: '100天运动打卡系列海报：KEEP MOVING，运动人物与粉红跑道' },
      { src: '/assets/posters/100-day-challenge.png', preview: '/assets/posters/100-day-challenge.jpg', width: 941, height: 1672, alt: '100天运动打卡系列海报：100 DAY CHALLENGE，打卡跑道与金色奖杯' },
      { src: '/assets/posters/100-days-every-day.png', preview: '/assets/posters/100-days-every-day.jpg', width: 941, height: 1672, alt: '100天运动打卡系列海报：MOVE A LITTLE EVERY DAY，数字100与草地运动场景' },
    ] : isOishi ? [
      { src: '/assets/posters/shrimp-flakes-product.webp', width: 1024, height: 1536, alt: '蒜香味鲜虾片产品海报：海浪、鲜虾片包装与大蒜' },
      { src: '/assets/posters/shrimp-flakes-beach.webp', width: 1021, height: 1541, alt: '蒜香味鲜虾片场景海报：两人在热带海滩分享鲜虾片' },
    ] : isOlakala ? [
      { src: '/assets/posters/olakala-neighbours-cherries-floating.png', width: 1086, height: 1448, alt: 'OLAKALA Neighbour’s Cherries 红色香水瓶居中，完整樱桃与切开的果肉悬浮在四周' },
      { src: '/assets/posters/olakala-neighbours-cherries-still-life.png', width: 1086, height: 1448, alt: 'OLAKALA Neighbour’s Cherries 红色香水瓶与鲜樱桃摆在白色台面上，底部映出倒影' },
    ] : [{
      src: card.querySelector('a.poster-card__art').href,
      width: Number(cover.getAttribute('width')),
      height: Number(cover.getAttribute('height')),
      alt: cover.alt,
    }];
  }

  function show(card, opener) {
    const cover = card.querySelector('img');
    if (!cover || dialog.open) return;
    const posters = postersFor(card, cover);
    title.textContent = card.querySelector('h4').textContent;
    dialog.dataset.layout = posters.length === 3 ? 'series' : posters.length === 1 ? 'single' : 'pair';
    dialog.style.setProperty('--poster-ratio', String(posters[0].width / posters[0].height));
    gallery.replaceChildren(...posters.map(poster => {
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      image.src = poster.src;
      image.width = poster.width;
      image.height = poster.height;
      image.alt = poster.alt;
      image.decoding = 'async';
      image.addEventListener('error', () => { image.src = cover.src; }, { once: true });
      figure.append(image);
      return figure;
    }));
    trigger = opener || card.querySelector('a');
    backdropStart = false;
    document.documentElement.classList.add('poster-gallery-open');
    dialog.showModal();
    dialog.scrollTop = 0;
  }
  document.addEventListener('click', event => {
    const card = event.target.closest?.('.poster-card');
    if (!card || event.target.closest('.poster-loop__toggle')) return;
    event.preventDefault();
    event.stopPropagation();
    show(card, event.target.closest('a'));
  }, true);

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const loopLoaders = new WeakMap();
  const loopObserver = new IntersectionObserver(entries => {
    for (const entry of entries) loopLoaders.get(entry.target)?.(entry.isIntersecting);
  });

  function addPosterLoop(card, art, cover, posters, name) {
    let visible = false;
    let hovered = false;
    let paused = reducedMotion.matches;
    let loading = false;
    let animation;
    const update = () => {
      if (!animation) return;
      if (visible && !hovered && !paused && !document.hidden && !dialog.open && document.activeElement !== art) {
        animation.play();
      } else {
        animation.pause();
      }
    };
    const start = async () => {
      loading = true;
      const track = document.createElement('span');
      track.className = 'poster-loop__track';
      track.setAttribute('aria-hidden', 'true');
      const sources = [cover.src, ...posters.slice(1).map(poster => poster.preview || poster.src), cover.src];
      try {
        const frames = await Promise.all(sources.map(async src => {
          const image = new Image();
          image.alt = '';
          image.src = src;
          await image.decode();
          return image;
        }));
        track.append(...frames);
      } catch {
        loopObserver.unobserve(card);
        return;
      }

      // The final frame repeats the first, so the animation can wrap without a jump.
      const keyframes = [];
      for (let i = 0; i < posters.length; i++) {
        const transform = `translateY(${-100 * i}%)`;
        keyframes.push(
          { transform, offset: i / posters.length },
          { transform, offset: (i + 0.86) / posters.length, easing: 'ease-in-out' }
        );
      }
      keyframes.push({ transform: `translateY(${-100 * posters.length}%)`, offset: 1 });
      art.classList.add('poster-loop');
      art.append(track);
      animation = track.animate(keyframes, { duration: posters.length * 4600, iterations: Infinity });

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'poster-loop__toggle';
      const syncToggle = () => {
        toggle.textContent = paused ? '▶' : 'Ⅱ';
        toggle.setAttribute('aria-label', `${paused ? '播放' : '暂停'}${name}的轮播`);
        update();
      };
      toggle.addEventListener('click', () => {
        paused = !paused;
        syncToggle();
      });
      reducedMotion.addEventListener('change', event => {
        paused = event.matches;
        syncToggle();
      });
      art.addEventListener('pointerenter', event => {
        hovered = event.pointerType !== 'touch';
        update();
      });
      art.addEventListener('pointerleave', () => {
        hovered = false;
        update();
      });
      art.addEventListener('focus', update);
      art.addEventListener('blur', () => requestAnimationFrame(update));
      document.addEventListener('visibilitychange', update);
      dialog.addEventListener('toggle', update);
      card.append(toggle);
      syncToggle();
    };
    loopLoaders.set(card, inView => {
      visible = inView;
      if (visible && !loading) start();
      update();
    });
    loopObserver.observe(card);
  }

  const positionCard = card => {
    const span = String(Math.ceil(card.offsetHeight + 26));
    if (card.style.gridRowEnd !== `span ${span}`) card.style.gridRowEnd = `span ${span}`;
  };
  const masonryObserver = new ResizeObserver(entries => entries.forEach(entry => positionCard(entry.target)));
  function enhance() {
    const cards = document.querySelectorAll('.poster-card');
    for (const card of cards) {
      masonryObserver.observe(card);
      positionCard(card);
      const name = card.querySelector('h4')?.textContent || '海报';
      const art = card.querySelector('.poster-card__art');
      const cover = art?.querySelector('img');
      if (!cover) continue;
      const posters = postersFor(card, cover);
      if (posters.length > 1) addPosterLoop(card, art, cover, posters, name);
      for (const link of card.querySelectorAll('a')) {
        link.removeAttribute('target');
        link.setAttribute('aria-haspopup', 'dialog');
        link.setAttribute('aria-controls', dialog.id);
        link.setAttribute('aria-label', `放大查看${name}${posters.length > 1 ? '的全部海报' : ''}`);
      }
    }
    return cards.length > 0;
  }
  if (!enhance()) {
    const observer = new MutationObserver(() => { if (enhance()) observer.disconnect(); });
    observer.observe(document.getElementById('root'), { childList: true, subtree: true });
  }
})();
