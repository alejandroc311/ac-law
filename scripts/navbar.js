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
  const path = location.pathname;
  const searchHash = (location.search || '') + (location.hash || '');

  const anchors = ['/es/', '/content/', '/resources/', '/index.html', '/contact.html'];

  let idx = -1, anchor = '';
  for (const a of anchors) {
    const i = path.indexOf(a);
    if (i !== -1 && (idx === -1 || i < idx)) { idx = i; anchor = a; }
  }

  if (idx === -1) {
    const relFallback = path.replace(/^\//, '') || 'index.html';
    const toggled = relFallback.startsWith('es/')
      ? relFallback.replace(/^es\//, '')
      : 'es/' + relFallback;
    return location.origin + '/' + toggled + searchHash;
  }

  const rootPath = path.slice(0, idx);

  let rel = path.slice(idx);
  if (rel.endsWith('/')) rel += 'index.html';

  // Treat root-level pages correctly when the anchor is the filename
  if (rel === '/index.html') rel = 'index.html';
  else if (rel === '/contact.html') rel = 'contact.html';
  else if (rel.startsWith('/')) rel = rel.slice(1);

  const toggledRel = rel.startsWith('es/') ? rel.replace(/^es\//, '') : 'es/' + rel;

  return location.origin + rootPath + (rootPath.endsWith('/') ? '' : '/') + toggledRel + searchHash;
}

