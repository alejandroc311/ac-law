(() => {
  const LANG_URL_MAP = {
  // Section homepages
  "bankruptcy/index.html": "quiebras/",
  "quiebras/index.html": "bankruptcy/",

  // Contact
  "bankruptcy/contact/index.html": "quiebras/contact/",
  "quiebras/contact/index.html": "bankruptcy/contact/",

  // Resources hub
  "bankruptcy/resources/index.html": "quiebras/resources/",
  "quiebras/resources/index.html": "bankruptcy/resources/",

  // Resources pages
  "bankruptcy/resources/chapter-7/index.html": "quiebras/resources/capitulo-7/",
  "quiebras/resources/capitulo-7/index.html": "bankruptcy/resources/chapter-7/",

  "bankruptcy/resources/chapter-13/index.html": "quiebras/resources/capitulo-13/",
  "quiebras/resources/capitulo-13/index.html": "bankruptcy/resources/chapter-13/",

  "bankruptcy/resources/automatic-stay/index.html": "quiebras/resources/paralizacion-automatica/",
  "quiebras/resources/paralizacion-automatica/index.html": "bankruptcy/resources/automatic-stay/",

  "bankruptcy/resources/means-test/index.html": "quiebras/resources/prueba-de-recursos/",
  "quiebras/resources/prueba-de-recursos/index.html": "bankruptcy/resources/means-test/",

  "bankruptcy/resources/exemptions/index.html": "quiebras/resources/exenciones-de-quiebra/",
  "quiebras/resources/exenciones-de-quiebra/index.html": "bankruptcy/resources/exemptions/",

  "bankruptcy/resources/dischargeable/index.html": "quiebras/resources/deudas-descargables/",
  "quiebras/resources/deudas-descargables/index.html": "bankruptcy/resources/dischargeable/",

  "bankruptcy/resources/7v13/index.html": "quiebras/resources/capitulo-7-vs-capitulo-13/",
  "quiebras/resources/capitulo-7-vs-capitulo-13/index.html": "bankruptcy/resources/7v13/",

  "bankruptcy/resources/timeline/index.html": "quiebras/resources/procedimiento-de-quiebras/",
  "quiebras/resources/procedimiento-de-quiebras/index.html": "bankruptcy/resources/timeline/",

  // Content pages
  "bankruptcy/content/garnishment/index.html": "quiebras/content/embargo/",
  "quiebras/content/embargo/index.html": "bankruptcy/content/garnishment/",

  "bankruptcy/content/foreclosure/index.html": "quiebras/content/ejecucion-de-hipoteca/",
  "quiebras/content/ejecucion-de-hipoteca/index.html": "bankruptcy/content/foreclosure/",

  "bankruptcy/content/bustout/index.html": "quiebras/content/deudas-agobiantes/",
  "quiebras/content/deudas-agobiantes/index.html": "bankruptcy/content/bustout/",
};

  document.addEventListener("DOMContentLoaded", () => {
    const a = document.getElementById("lang-switch-footer");
    if (!a) return;

    const currentPath = getCurrentPath();
    const targetPath = LANG_URL_MAP[currentPath];

    if (!targetPath) {
      console.warn("No footer language mapping found for:", currentPath);
      return;
    }

    const target = buildRelativeHref(currentPath, targetPath);
    const isSpanish = currentPath.startsWith("quiebras/");

    a.textContent = isSpanish ? "English" : "Español";
    a.setAttribute("href", target);
    a.setAttribute("lang", isSpanish ? "en" : "es");
    a.setAttribute(
      "aria-label",
      isSpanish ? "Switch to English" : "Cambiar a español",
    );
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
