document.addEventListener("DOMContentLoaded", () => {
  // Year stamp
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Footer language switch
  const a = document.getElementById("lang-switch-footer");
  if (!a) return;

  const isFile = location.protocol === "file:";
  const isEs = /(?:^|\/)es\//.test(location.pathname); // matches ".../es/..."

  let label, href;

  if (isFile) {
    // Build RELATIVE URLs for local file:// browsing
    if (isEs) {
      label = "English";
      href = new URL("../index.html", location.href).href; // /es/index.html -> ../index.html
    } else {
      label = "Español";
      href = new URL("es/index.html", location.href).href; // /index.html -> es/index.html
    }
  } else {
    // Build site-rooted URLs for http(s)
    if (isEs) {
      label = "English";
      href = location.pathname.replace(/\/es\//, "/"); // e.g. /es/page/ -> /page/
    } else {
      label = "Español";
      href = "/es" + location.pathname;
    }
  }

  a.textContent = label;
  a.setAttribute("href", href);
  a.setAttribute("lang", label.toLowerCase());
});
