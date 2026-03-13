// Shared theme presets and helpers.
// Used by both the theme playground and the site-wide preset switcher.

var mdstTheme = (function () {
  var unitVars = {
    "--mdst-radius": "px",
    "--mdst-border-width": "px",
  };

  function toCSSValue(varName, rawValue) {
    return unitVars[varName] ? rawValue + unitVars[varName] : rawValue;
  }

  function toRawValue(varName, cssValue) {
    if (unitVars[varName]) {
      return cssValue.replace(unitVars[varName], "");
    }
    return cssValue;
  }

  var presets = {
    default: {
      "--mdst-color-fg": "#000000",
      "--mdst-color-bg": "#ffffff",
      "--mdst-color-border": "#000000",
      "--mdst-color-muted": "#666666",
      "--mdst-color-subtle": "#f5f5f5",
      "--mdst-color-focus": "#000000",
      "--mdst-color-error": "#dc2626",
      "--mdst-color-success": "#16a34a",
      "--mdst-button-hover-bg": "#000000",
      "--mdst-button-hover-color": "#ffffff",
      "--mdst-button-hover-border": "#000000",
      "--mdst-radius": "0",
      "--mdst-border-width": "1",
    },
    dark: {
      "--mdst-color-fg": "#ffffff",
      "--mdst-color-bg": "#1a1a1a",
      "--mdst-color-border": "#ffffff",
      "--mdst-color-muted": "#999999",
      "--mdst-color-subtle": "#2a2a2a",
      "--mdst-color-focus": "#ffffff",
      "--mdst-color-error": "#f87171",
      "--mdst-color-success": "#4ade80",
      "--mdst-button-hover-bg": "#ffffff",
      "--mdst-button-hover-color": "#1a1a1a",
      "--mdst-button-hover-border": "#ffffff",
      "--mdst-radius": "0",
      "--mdst-border-width": "1",
    },
    rounded: {
      "--mdst-color-fg": "#000000",
      "--mdst-color-bg": "#ffffff",
      "--mdst-color-border": "#d1d5db",
      "--mdst-color-muted": "#6b7280",
      "--mdst-color-subtle": "#f9fafb",
      "--mdst-color-focus": "#3b82f6",
      "--mdst-color-error": "#ef4444",
      "--mdst-color-success": "#22c55e",
      "--mdst-button-hover-bg": "#f9fafb",
      "--mdst-button-hover-color": "#000000",
      "--mdst-button-hover-border": "#000000",
      "--mdst-radius": "8",
      "--mdst-border-width": "1",
    },
    blue: {
      "--mdst-color-fg": "#1e3a5f",
      "--mdst-color-bg": "#ffffff",
      "--mdst-color-border": "#1e3a5f",
      "--mdst-color-muted": "#5a7a9a",
      "--mdst-color-subtle": "#e8f0f8",
      "--mdst-color-focus": "#2563eb",
      "--mdst-color-error": "#dc2626",
      "--mdst-color-success": "#16a34a",
      "--mdst-button-hover-bg": "#1e3a5f",
      "--mdst-button-hover-color": "#ffffff",
      "--mdst-button-hover-border": "#1e3a5f",
      "--mdst-radius": "4",
      "--mdst-border-width": "1",
    },
    brutalist: {
      "--mdst-color-fg": "#000000",
      "--mdst-color-bg": "#ffffff",
      "--mdst-color-border": "#000000",
      "--mdst-color-muted": "#000000",
      "--mdst-color-subtle": "#ffff00",
      "--mdst-color-focus": "#ff0000",
      "--mdst-color-error": "#ff0000",
      "--mdst-color-success": "#00ff00",
      "--mdst-button-hover-bg": "#000000",
      "--mdst-button-hover-color": "#ffffff",
      "--mdst-button-hover-border": "#000000",
      "--mdst-radius": "0",
      "--mdst-border-width": "3",
    },
    pastel: {
      "--mdst-color-fg": "#5b4b8a",
      "--mdst-color-bg": "#fdf4f5",
      "--mdst-color-border": "#d4a5a5",
      "--mdst-color-muted": "#9a8c98",
      "--mdst-color-subtle": "#f0e6ef",
      "--mdst-color-focus": "#c9ada7",
      "--mdst-color-error": "#e07a7a",
      "--mdst-color-success": "#7ab08e",
      "--mdst-button-hover-bg": "#f0e6ef",
      "--mdst-button-hover-color": "#5b4b8a",
      "--mdst-button-hover-border": "#5b4b8a",
      "--mdst-radius": "12",
      "--mdst-border-width": "1.5",
    },
    terminal: {
      "--mdst-color-fg": "#00EE00",
      "--mdst-color-bg": "#0d0d0d",
      "--mdst-color-border": "#00EE00",
      "--mdst-color-muted": "#098109",
      "--mdst-color-subtle": "#1a1a1a",
      "--mdst-color-focus": "#52017e",
      "--mdst-color-error": "#ff0000",
      "--mdst-color-success": "#00d5ff",
      "--mdst-button-hover-bg": "#00EE00",
      "--mdst-button-hover-color": "#0d0d0d",
      "--mdst-button-hover-border": "#00EE00",
      "--mdst-radius": "0",
      "--mdst-border-width": "1",
    },
    warm: {
      "--mdst-color-fg": "#3d2c29",
      "--mdst-color-bg": "#faf6f1",
      "--mdst-color-border": "#c9b99a",
      "--mdst-color-muted": "#8b7355",
      "--mdst-color-subtle": "#f0e9df",
      "--mdst-color-focus": "#b08968",
      "--mdst-color-error": "#c44536",
      "--mdst-color-success": "#6b8f71",
      "--mdst-button-hover-bg": "#f0e9df",
      "--mdst-button-hover-color": "#3d2c29",
      "--mdst-button-hover-border": "#3d2c29",
      "--mdst-radius": "4",
      "--mdst-border-width": "1",
    },
    highcontrast: {
      "--mdst-color-fg": "#000000",
      "--mdst-color-bg": "#ffffff",
      "--mdst-color-border": "#000000",
      "--mdst-color-muted": "#000000",
      "--mdst-color-subtle": "#ffffff",
      "--mdst-color-focus": "#0000ff",
      "--mdst-color-error": "#ff0000",
      "--mdst-color-success": "#008000",
      "--mdst-button-hover-bg": "#000000",
      "--mdst-button-hover-color": "#ffffff",
      "--mdst-button-hover-border": "#000000",
      "--mdst-radius": "0",
      "--mdst-border-width": "2",
    },
  };

  // Build CSS-ready vars object from a raw preset
  function buildCSSVars(rawPreset) {
    var result = {};
    for (var key in rawPreset) {
      result[key] = toCSSValue(key, rawPreset[key]);
    }
    return result;
  }

  // Apply a CSS vars object to :root
  function applyVars(cssVars) {
    var style = document.documentElement.style;
    for (var key in cssVars) {
      style.setProperty(key, cssVars[key]);
    }
  }

  // Clear all theme overrides from :root inline styles
  function clearVars() {
    var style = document.documentElement.style;
    var keys = Object.keys(presets.default);
    for (var i = 0; i < keys.length; i++) {
      style.removeProperty(keys[i]);
    }
  }

  // Persist CSS-ready vars to localStorage
  function persist(cssVars) {
    try {
      localStorage.setItem("mdst-theme", JSON.stringify(cssVars));
    } catch (e) {
      localStorage.removeItem("mdst-theme");
    }
  }

  // Load stored CSS vars, or null if nothing valid is stored
  function load() {
    try {
      var raw = localStorage.getItem("mdst-theme");
      if (!raw) return null;
      var stored = JSON.parse(raw);
      if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
        throw 0;
      }
      return stored;
    } catch (e) {
      localStorage.removeItem("mdst-theme");
      return null;
    }
  }

  // Apply a named preset: set vars, persist, return true. Returns false if unknown.
  function applyPreset(name) {
    var preset = presets[name];
    if (!preset) return false;
    var cssVars = buildCSSVars(preset);
    applyVars(cssVars);
    persist(cssVars);
    return true;
  }

  // Reset to default: clear inline styles, remove stored theme
  function reset() {
    clearVars();
    localStorage.removeItem("mdst-theme");
  }

  // Detect which preset matches a CSS vars object, or null if custom
  function detectPreset(cssVars) {
    var names = Object.keys(presets);
    for (var i = 0; i < names.length; i++) {
      var name = names[i];
      var preset = buildCSSVars(presets[name]);
      var match = true;
      for (var key in preset) {
        if (preset[key] !== cssVars[key]) {
          match = false;
          break;
        }
      }
      if (match) return name;
    }
    return null;
  }

  return {
    unitVars: unitVars,
    toCSSValue: toCSSValue,
    toRawValue: toRawValue,
    presets: presets,
    buildCSSVars: buildCSSVars,
    applyVars: applyVars,
    clearVars: clearVars,
    persist: persist,
    load: load,
    applyPreset: applyPreset,
    reset: reset,
    detectPreset: detectPreset,
  };
})();
