// /js/problems-toggle.js
document.addEventListener('DOMContentLoaded', () => {
  const grid   = document.getElementById('problems-grid');
  const cards  = grid ? Array.from(grid.querySelectorAll('.problem-card')) : [];
  const toggle = document.getElementById('problems-toggle');       // your See more/less button
  const more   = document.getElementById('problems-more-link');    // your "More resources" <a>

  if (!grid || !cards.length || !toggle) return;

  // Breakpoint (Tailwind md)
  const MD = 768;

  // Per-breakpoint caps (tweak to taste)
  const SMALL = { collapsed: 2, expanded: 3 };   // phones
  const DESK  = { collapsed: 3, expanded: 3 };   // md+ (tablets/desktops)

  let expanded = false;

  // ensure links start hidden unless needed
  if (more) {
    more.classList.add('hidden');
    if (more.parentElement) more.parentElement.classList.add('hidden');
  }

  const render = () => {
    const isDesktop = window.innerWidth >= MD;
    const caps = isDesktop ? DESK : SMALL;

    // How many to show right now?
    const showCount = expanded
      ? Math.min(caps.expanded, cards.length)
      : Math.min(caps.collapsed, cards.length);

    // Show/hide cards to the computed count
    cards.forEach((c, i) => {
      if (i < showCount) { c.classList.remove('hidden'); c.classList.add('block'); }
      else               { c.classList.add('hidden');    c.classList.remove('block'); }
    });

    // Show toggle only if there are more than the collapsed count
    const needsToggle = cards.length > caps.collapsed;
    toggle.classList.toggle('hidden', !needsToggle);
    toggle.textContent = expanded ? 'See less' : 'See more';
    toggle.setAttribute('aria-expanded', String(expanded));

    // "More resources" appears only when expanded AND there are more than the expanded cap
    if (more) {
      const hasBeyondCap = cards.length > caps.expanded;
      const showMoreLink = expanded && hasBeyondCap;
      more.classList.toggle('hidden', !showMoreLink);
      if (more.parentElement) more.parentElement.classList.toggle('hidden', !showMoreLink);
    }
  };

  toggle.addEventListener('click', () => { expanded = !expanded; render(); });
  window.addEventListener('resize', render);

  // Initial paint
  render();
});
