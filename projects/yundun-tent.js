(() => {
  const viewer = document.querySelector('.tent-viewer');
  const large = document.querySelector('#tent-large');
  const caption = document.querySelector('#tent-caption');
  document.querySelectorAll('.tent-board a').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      large.src = link.href;
      large.alt = link.querySelector('img').alt;
      caption.textContent = link.closest('figure').querySelector('figcaption').textContent;
      viewer.showModal();
      viewer.scrollTop = 0;
    });
  });
  document.querySelector('#tent-close').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const bounds = viewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) viewer.close();
  });
})();
