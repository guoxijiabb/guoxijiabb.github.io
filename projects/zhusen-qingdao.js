// Preview-only presentation: no original-file link or download control.
// These scoped deterrents cannot prevent screenshots or technical extraction.
document.querySelectorAll('.qingdao-plan').forEach(plan => {
  plan.addEventListener('contextmenu', event => {
    if (event.target.closest('.preview-surface')) event.preventDefault();
  });
  plan.addEventListener('dragstart', event => {
    if (event.target instanceof HTMLImageElement) event.preventDefault();
  });
});
