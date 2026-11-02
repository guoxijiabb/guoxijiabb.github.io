(() => {
  const dialog = document.createElement('dialog');
  dialog.className = 'photography-viewer';
  dialog.setAttribute('aria-labelledby', 'photo-view-title');
  dialog.innerHTML = '<header class="photo-view-head"><h3 class="photo-view-title" id="photo-view-title"></h3><button type="button" data-photo-close aria-label="关闭摄影预览">关闭 ×</button></header><img class="photo-view-image" alt=""><footer class="photo-view-foot"><span class="photo-view-count"></span><div class="photo-view-controls"><button type="button" data-photo-prev aria-label="上一张摄影作品">←</button><button type="button" data-photo-next aria-label="下一张摄影作品">→</button></div></footer>';
  document.body.append(dialog);
  let photos = [], index = 0, opener;
  const show = next => {
    index = (next + photos.length) % photos.length;
    const link = photos[index], image = dialog.querySelector('img');
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    dialog.querySelector('h3').textContent = link.closest('figure').querySelector('figcaption').textContent.slice(2).trim();
    dialog.querySelector('.photo-view-count').textContent = `${String(index + 1).padStart(2, '0')} / ${photos.length}`;
  };
  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[data-photo-index]');
    if (!link) return;
    event.preventDefault();
    photos = [...document.querySelectorAll('a[data-photo-index]')];
    opener = link;
    show(photos.indexOf(link));
    document.documentElement.classList.add('photo-view-open');
    dialog.showModal();
  });
  dialog.querySelector('[data-photo-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-photo-prev]').addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-photo-next]').addEventListener('click', () => show(index + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); show(index + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  let outsideStart = false;
  const outside = event => { const r = dialog.getBoundingClientRect(); return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom; };
  dialog.addEventListener('pointerdown', event => { outsideStart = outside(event); });
  dialog.addEventListener('click', event => { if (outsideStart && outside(event)) dialog.close(); });
  dialog.addEventListener('close', () => { document.documentElement.classList.remove('photo-view-open'); opener?.focus({ preventScroll: true }); });
})();
