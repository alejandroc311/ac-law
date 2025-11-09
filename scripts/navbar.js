document.addEventListener('DOMContentLoaded', () => {
  /* ========= 1) Mobile menu ========= */
  const btn  = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('hidden');
    });
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        btn.setAttribute('aria-expanded', 'false');
        menu.classList.add('hidden');
      });
    });
  }

  /* ========= 2) Language switch (desktop + mobile) ========= */
  const switches = [
    document.getElementById('lang-switch-desktop'),
    document.getElementById('lang-switch-mobile'),
  ].filter(Boolean);
  if (!switches.length) return;

  const target = computeLangCounterpart();
  if (!target) return;

  const isEs = /(?:^|\/)es(?:\/|$)/.test(location.pathname);
  const label = isEs ? 'English' : 'Español';
  const langAttr = isEs ? 'en' : 'es';

  switches.forEach(a => {
    a.textContent = label;
    a.setAttribute('href', target);
    a.setAttribute('lang', langAttr);
  });
});

/* ===== helper: build counterpart URL reliably on file:// and http(s) ===== */
function computeLangCounterpart() {
  const path = location.pathname;                 // absolute OS path under file://, site path under http
  const searchHash = (location.search || '') + (location.hash || '');

  // Find the first “anchor” folder that marks the start of page-relative path
  const anchors = ['/es/', '/content/', '/resources/', '/index.html'];
  let idx = -1, anchor = '';
  for (const a of anchors) {
    const i = path.indexOf(a);
    if (i !== -1 && (idx === -1 || i < idx)) { idx = i; anchor = a; }
  }

  // If none found, fall back to entire path (shouldn’t happen with your structure)
  if (idx === -1) {
    // Toggle simply at the very beginning
    const relFallback = path.replace(/^\//, '') || 'index.html';
    const toggled = relFallback.startsWith('es/') ? relFallback.replace(/^es\//, '') : 'es/' + relFallback;
    return location.origin + '/' + toggled + searchHash;
  }

  // Absolute root path up to (but not including) the anchor (keeps full OS path on file://)
  const rootPath = path.slice(0, idx);

  // Relative part starting at the anchor (normalize directories to index.html)
  let rel = path.slice(idx);
  if (rel.endsWith('/')) rel += 'index.html';
  if (rel === '/index.html') rel = 'index.html';           // root English
  else if (rel.startsWith('/')) rel = rel.slice(1);        // drop leading slash => e.g. "content/x.html" or "es/content/x.html"

  // Toggle leading "es/"
  const toggledRel = rel.startsWith('es/') ? rel.replace(/^es\//, '') : 'es/' + rel;

  // Rebuild absolute path preserving scheme/origin
  // On file://, origin is "file://"; on http, it's "https://domain"
  return location.origin + rootPath + (rootPath.endsWith('/') ? '' : '/') + toggledRel + searchHash;
}
