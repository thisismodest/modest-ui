// Theme persistence — applies stored theme CSS vars to :root before paint.
// If stored data is invalid or can't be parsed, it is silently discarded.
(function () {
  try {
    var raw = localStorage.getItem("mdst-theme");
    if (!raw) return;
    var vars = JSON.parse(raw);
    if (!vars || typeof vars !== "object" || Array.isArray(vars)) throw 0;
    var style = document.documentElement.style;
    for (var key in vars) {
      style.setProperty(key, vars[key]);
    }
  } catch (e) {
    localStorage.removeItem("mdst-theme");
  }
})();
