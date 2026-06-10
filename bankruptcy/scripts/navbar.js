(() => {
  const LANG_URL_MAP = {
    "bankruptcy/index.html": "quiebras/",
    "quiebras/index.html": "bankruptcy/",

    "bankruptcy/contact.html": "quiebras/contact.html",
    "quiebras/contact.html": "bankruptcy/contact.html",

    "bankruptcy/resources/resources.html": "quiebras/resources/resources.html",
    "quiebras/resources/resources.html": "bankruptcy/resources/resources.html",

    "bankruptcy/resources/chapter-7.html": "quiebras/resources/capitulo-7.html",
    "quiebras/resources/capitulo-7.html": "bankruptcy/resources/chapter-7.html",

    "bankruptcy/resources/chapter-13.html":
      "quiebras/resources/capitulo-13.html",
    "quiebras/resources/capitulo-13.html":
      "bankruptcy/resources/chapter-13.html",

    "bankruptcy/resources/automatic-stay.html":
      "quiebras/resources/paralizacion-automatica.html",
    "quiebras/resources/paralizacion-automatica.html":
      "bankruptcy/resources/automatic-stay.html",

    "bankruptcy/resources/means-test.html":
      "quiebras/resources/prueba-de-recursos.html",
    "quiebras/resources/prueba-de-recursos.html":
      "bankruptcy/resources/means-test.html",

    "bankruptcy/resources/exemptions.html":
      "quiebras/resources/exenciones-de-quiebra.html",
    "quiebras/resources/exenciones-de-quiebra.html":
      "bankruptcy/resources/exemptions.html",

    "bankruptcy/resources/dischargeable.html":
      "quiebras/resources/deudas-descargables.html",
    "quiebras/resources/deudas-descargables.html":
      "bankruptcy/resources/dischargeable.html",

    "bankruptcy/resources/7v13.html":
      "quiebras/resources/capitulo-7-vs-capitulo-13.html",
    "quiebras/resources/capitulo-7-vs-capitulo-13.html":
      "bankruptcy/resources/7v13.html",

    "bankruptcy/resources/timeline.html":
      "quiebras/resources/procedimiento-de-quiebras.html",
    "quiebras/resources/procedimiento-de-quiebras.html":
      "bankruptcy/resources/timeline.html",

    "bankruptcy/content/garnishment.html": "quiebras/content/embargo.html",
    "quiebras/content/embargo.html": "bankruptcy/content/garnishment.html",

    "bankruptcy/content/foreclosure.html":
      "quiebras/content/ejecucion-de-hipoteca.html",
    "quiebras/content/ejecucion-de-hipoteca.html":
      "bankruptcy/content/foreclosure.html",

    "bankruptcy/content/bustout.html":
      "quiebras/content/deudas-agobiantes.html",
    "quiebras/content/deudas-agobiantes.html":
      "bankruptcy/content/bustout.html",
  };

  document.addEventListener("DOMContentLoaded", () => {
    /* ========= 1) Mobile menu ========= */
    const btn = document.getElementById("nav-toggle");
    const menu = document.getElementById("mobile-menu");

    if (btn && menu) {
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
    }

    /* ========= 2) Language switch desktop + mobile ========= */
    const switches = [
      document.getElementById("lang-switch-desktop"),
      document.getElementById("lang-switch-mobile"),
    ].filter(Boolean);

    if (!switches.length) return;

    const currentPath = getCurrentPath();
    const targetPath = LANG_URL_MAP[currentPath];

    if (!targetPath) {
      console.warn("No language mapping found for:", currentPath);
      return;
    }

    const target = buildRelativeHref(currentPath, targetPath);
    const isSpanish = currentPath.startsWith("quiebras/");

    switches.forEach((a) => {
      a.textContent = isSpanish ? "English" : "Español";
      a.setAttribute("href", target);
      a.setAttribute("lang", isSpanish ? "en" : "es");
      a.setAttribute(
        "aria-label",
        isSpanish ? "Switch to English" : "Cambiar a español",
      );
    });
  });

  function getCurrentPath() {
    let path = location.pathname;

    if (path.endsWith("/")) {
      path += "index.html";
    }

    path = path.replace(/^\/+/, "");

    const markers = ["bankruptcy/", "quiebras/"];

    for (const marker of markers) {
      const idx = path.indexOf(marker);

      if (idx !== -1) {
        return path.slice(idx);
      }
    }

    return "";
  }

  function buildRelativeHref(currentPath, targetPath) {
    const depth = currentPath.split("/").length - 1;

    if (depth === 0) {
      return "./" + targetPath;
    }

    return "../".repeat(depth) + targetPath;
  }
})();
