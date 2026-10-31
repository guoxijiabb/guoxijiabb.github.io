(() => {
  const boards = [...document.querySelectorAll('button.board[data-page]')];
  const dialog = document.querySelector('.image-viewer');
  if (!dialog || !boards.length || typeof dialog.showModal !== 'function') return;

  const image = dialog.querySelector('.viewer-image');
  const title = dialog.querySelector('#viewer-title');
  const count = dialog.querySelector('.viewer-count');
  const stage = dialog.querySelector('.viewer-stage');
  const previous = dialog.querySelector('.viewer-prev');
  const next = dialog.querySelector('.viewer-next');
  const zoom = dialog.querySelector('.viewer-zoom');
  let active = 0;
  let opener = null;
  let zoomed = false;

  function setZoom(value) {
    zoomed = value;
    stage.classList.toggle('is-zoomed', value);
    zoom.setAttribute('aria-pressed', String(value));
    zoom.textContent = value ? '适应屏幕' : '原尺寸查看';
    stage.scrollTo(0, 0);
  }

  function showPage(index) {
    active = Math.max(0, Math.min(boards.length - 1, index));
    const source = boards[active].querySelector('img');
    image.src = source.src;
    image.alt = source.alt;
    title.textContent = boards[active].closest('section').querySelector('h2').textContent;
    count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(boards.length).padStart(2, '0')}`;
    previous.disabled = active === 0;
    next.disabled = active === boards.length - 1;
    setZoom(false);
  }

  boards.forEach((board, index) => {
    board.addEventListener('click', () => {
      opener = board;
      showPage(index);
      dialog.showModal();
      document.body.classList.add('viewer-open');
      dialog.querySelector('.viewer-close').focus();
    });
  });

  dialog.querySelector('.viewer-close').addEventListener('click', () => dialog.close());
  previous.addEventListener('click', () => showPage(active - 1));
  next.addEventListener('click', () => showPage(active + 1));
  zoom.addEventListener('click', () => setZoom(!zoomed));
  dialog.addEventListener('keydown', (event) => {
    if (zoomed || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPage(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('viewer-open');
    setZoom(false);
    opener?.focus({ preventScroll: true });
  });
})();
