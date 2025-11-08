// (function () {
//   const btn = document.getElementById("nav-toggle");
//   const menu = document.getElementById("mobile-menu");
//   if (!btn || !menu) return;

//   btn.addEventListener("click", () => {
//     const expanded = btn.getAttribute("aria-expanded") === "true";
//     btn.setAttribute("aria-expanded", String(!expanded));
//     menu.classList.toggle("hidden");
//   });

//   // (optional) close menu when a link is clicked
//   menu.querySelectorAll("a").forEach((a) => {
//     a.addEventListener("click", () => {
//       btn.setAttribute("aria-expanded", "false");
//       menu.classList.add("hidden");
//     });
//   });
// })();

// /js/navbar.js
(() => {
  const btn = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("hidden");
  });

  menu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      btn.setAttribute("aria-expanded", "false");
      menu.classList.add("hidden");
    });
  });
})(); // ← don’t forget this!

// Put this at the end of /js/navbar.js (after your toggle code)
// /js/navbar.js (append or replace your lang-switch block)
(() => {
  const desktop = document.getElementById("lang-switch-desktop");
  const mobile = document.getElementById("lang-switch-mobile");
  const els = [desktop, mobile].filter(Boolean);
  if (!els.length) return;

  const isFile = location.protocol === "file:";
  const isEs = /(?:^|\/)es\//.test(location.pathname); // matches ".../es/..."

  let label, href;

  if (isFile) {
    // Use RELATIVE paths under file://
    if (isEs) {
      label = "English";
      // from .../es/index.html -> ../index.html
      href = new URL("../index.html", location.href).href;
    } else {
      label = "Español";
      // from .../index.html -> es/index.html
      href = new URL("es/index.html", location.href).href;
    }
  } else {
    // Use site-rooted paths under http(s)://
    if (isEs) {
      label = "English";
      href = location.pathname.replace(/\/es\//, "/"); // /es/foo/ -> /foo/
    } else {
      label = "Español";
      href = "/es" + location.pathname;
    }
  }

  els.forEach((a) => {
    a.textContent = label;
    a.setAttribute("href", href);
    a.setAttribute("lang", label === "Español" ? "es" : "en");
  });
})();
