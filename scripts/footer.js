document.addEventListener("DOMContentLoaded", () => {
  const a = document.getElementById("lang-switch-footer");
  if (!a) return;

  const target = computeLangCounterpart();
  if (!target) return;

  const isEs = /(?:^|\/)es(?:\/|$)/.test(location.pathname);
  a.textContent = isEs ? "English" : "Español";
  a.setAttribute("href", target);
  a.setAttribute("lang", isEs ? "en" : "es");
});

/* same helper as navbar.js — keep in this file too */
function computeLangCounterpart() {
  const path = location.pathname;
  const searchHash = (location.search || "") + (location.hash || "");

  const anchors = [
    "/es/",
    "/content/",
    "/resources/",
    "/index.html",
    "/contact.html",
  ];

  let idx = -1,
    anchor = "";
  for (const a of anchors) {
    const i = path.indexOf(a);
    if (i !== -1 && (idx === -1 || i < idx)) {
      idx = i;
      anchor = a;
    }
  }

  if (idx === -1) {
    const relFallback = path.replace(/^\//, "") || "index.html";
    const toggled = relFallback.startsWith("es/")
      ? relFallback.replace(/^es\//, "")
      : "es/" + relFallback;
    return location.origin + "/" + toggled + searchHash;
  }

  const rootPath = path.slice(0, idx);

  let rel = path.slice(idx);
  if (rel.endsWith("/")) rel += "index.html";

  // Treat root-level pages correctly when the anchor is the filename
  if (rel === "/index.html") rel = "index.html";
  else if (rel === "/contact.html") rel = "contact.html";
  else if (rel.startsWith("/")) rel = rel.slice(1);

  const toggledRel = rel.startsWith("es/")
    ? rel.replace(/^es\//, "")
    : "es/" + rel;

  return (
    location.origin +
    rootPath +
    (rootPath.endsWith("/") ? "" : "/") +
    toggledRel +
    searchHash
  );
}
