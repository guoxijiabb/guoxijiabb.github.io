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

  function show(card, opener) {
    const cover = card.querySelector('img');
    if (!cover || dialog.open) return;
    const isOishi = cover.src.includes('shrimp-flakes-product');
    const isMovement = cover.src.includes('100-days-keep-moving');
    const posters = isMovement ? [
      { src: '/assets/posters/100-days-keep-moving.png', width: 941, height: 1672, alt: '100天运动打卡系列海报：KEEP MOVING，运动人物与粉红跑道' },
      { src: '/assets/posters/100-day-challenge.png', width: 941, height: 1672, alt: '100天运动打卡系列海报：100 DAY CHALLENGE，打卡跑道与金色奖杯' },
      { src: '/assets/posters/100-days-every-day.png', width: 941, height: 1672, alt: '100天运动打卡系列海报：MOVE A LITTLE EVERY DAY，数字100与草地运动场景' },
    ] : isOishi ? [
      { src: '/assets/posters/shrimp-flakes-product.webp', width: 1024, height: 1536, alt: '蒜香味鲜虾片产品海报：海浪、鲜虾片包装与大蒜' },
      { src: '/assets/posters/shrimp-flakes-beach.webp', width: 1021, height: 1541, alt: '蒜香味鲜虾片场景海报：两人在热带海滩分享鲜虾片' },
    ] : [{
      src: card.querySelector('a.poster-card__art').href,
      width: Number(cover.getAttribute('width')),
      height: Number(cover.getAttribute('height')),
      alt: cover.alt,
    }];
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
    if (!card) return;
    event.preventDefault();
    event.stopPropagation();
    show(card, event.target.closest('a'));
  }, true);

  function enhance() {
    const cards = document.querySelectorAll('.poster-card');
    for (const card of cards) {
      const name = card.querySelector('h4')?.textContent || '海报';
      for (const link of card.querySelectorAll('a')) {
        link.removeAttribute('target');
        link.setAttribute('aria-haspopup', 'dialog');
        link.setAttribute('aria-controls', dialog.id);
        link.setAttribute('aria-label', `放大查看${name}${card.querySelector('img')?.src.includes('100-days-keep-moving') ? '三张海报' : card.querySelector('img')?.src.includes('shrimp-flakes-product') ? '两张海报' : '海报'}`);
      }
    }
    return cards.length > 0;
  }
  if (!enhance()) {
    const observer = new MutationObserver(() => { if (enhance()) observer.disconnect(); });
    observer.observe(document.getElementById('root'), { childList: true, subtree: true });
  }
})();
