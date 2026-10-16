// Theme persistence — applies stored theme CSS vars to :root before paint.
// If stored data is invalid or can't be parsed, it is silently discarded.
(() => {
  try {
    const raw = localStorage.getItem("mdst-theme");
    if (!raw) return;
    const vars = JSON.parse(raw);
    if (!vars || typeof vars !== "object" || Array.isArray(vars)) throw 0;
    const style = document.documentElement.style;
    for (const key in vars) {
      style.setProperty(key, vars[key]);
    }
  } catch {
    localStorage.removeItem("mdst-theme");
  }
})();
