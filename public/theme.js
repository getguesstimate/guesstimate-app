/* Generated from src/themes/runtime.mjs. */
(function initializeTheme(themes) {
  const key = "guesstimate.appearance.theme";
  const root = document.documentElement;
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const valid = (value) => value === "system" || Object.hasOwn(themes, value);
  const read = () => {
    try {
      const value = localStorage.getItem(key);
      return value && valid(value) ? value : "system";
    } catch {
      return "system";
    }
  };
  let preference = read();
  const apply = () => {
    const resolved =
      preference === "system" ? (media.matches ? "dark" : "light") : preference;
    root.dataset.theme = resolved;
    root.dataset.themePreference = preference;
    root.style.colorScheme = themes[resolved].colorScheme;
    window.dispatchEvent(new Event("guesstimate:theme-change"));
  };
  window.guesstimateTheme = {
    setPreference(value) {
      if (!valid(value)) return false;
      preference = value;
      let saved = true;
      try {
        localStorage.setItem(key, value);
      } catch {
        saved = false;
      }
      apply();
      return saved;
    },
  };
  media.addEventListener("change", () => {
    if (preference === "system") apply();
  });
  window.addEventListener("storage", (event) => {
    if (event.key === key || event.key === null) {
      preference = read();
      apply();
    }
  });
  apply();
})({"light":{"colorScheme":"light"},"dark":{"colorScheme":"dark"}});
