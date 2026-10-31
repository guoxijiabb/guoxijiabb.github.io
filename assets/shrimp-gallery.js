/* Scoped enhancement for the two user-supplied Oishi posters. */
(() => {
  const dialog = document.createElement('dialog');
  dialog.id = 'shrimp-posters';
  dialog.className = 'shrimp-gallery';
  dialog.setAttribute('aria-labelledby', 'shrimp-gallery-title');
  dialog.innerHTML = `
    <header class="shrimp-gallery__header">
      <h2 id="shrimp-gallery-title">上好佳 · 蒜香味鲜虾片</h2>
      <button class="shrimp-gallery__close" type="button" autofocus aria-label="关闭海报预览">
        关闭 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>
      </button>
    </header>
    <div class="shrimp-gallery__pair">
      <figure><img src="/assets/posters/shrimp-flakes-product.webp" width="1024" height="1536" alt="蒜香味鲜虾片产品海报：海浪、鲜虾片包装与大蒜" decoding="async"></figure>
      <figure><img src="/assets/posters/shrimp-flakes-beach.webp" width="1021" height="1541" alt="蒜香味鲜虾片场景海报：两人在热带海滩分享鲜虾片" decoding="async"></figure>
    </div>`;
  document.body.append(dialog);

  let trigger;
  const close = () => dialog.close();
  dialog.querySelector('button').addEventListener('click', close);
  // Require both ends of a pointer gesture to be on the backdrop.
  let backdropStart = false;
  const outside = event => {
    const rect = dialog.getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  dialog.addEventListener('pointerdown', event => { backdropStart = outside(event); });
  dialog.addEventListener('click', event => { if (backdropStart && outside(event)) close(); });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('shrimp-gallery-open');
    trigger?.focus({ preventScroll: true });
  });

  document.addEventListener('click', event => {
    const card = event.target.closest?.('.poster-card');
    if (!card?.querySelector('img[src*="shrimp-flakes-product"]')) return;
    event.preventDefault();
    event.stopPropagation();
    if (dialog.open) return;
    trigger = event.target.closest('a') || card.querySelector('a');
    document.documentElement.classList.add('shrimp-gallery-open');
    dialog.showModal();
  }, true);

  const enhance = () => {
    const image = document.querySelector('.poster-card img[src*="shrimp-flakes-product"]');
    if (!image) return false;
    for (const link of image.closest('.poster-card').querySelectorAll('a')) {
      link.href = '#shrimp-posters';
      link.removeAttribute('target');
      link.setAttribute('aria-haspopup', 'dialog');
      link.setAttribute('aria-controls', dialog.id);
      link.setAttribute('aria-label', '查看上好佳蒜香味鲜虾片两张海报');
    }
    return true;
  };
  if (!enhance()) {
    const observer = new MutationObserver(() => { if (enhance()) observer.disconnect(); });
    observer.observe(document.getElementById('root'), { childList: true, subtree: true });
  }
})();
