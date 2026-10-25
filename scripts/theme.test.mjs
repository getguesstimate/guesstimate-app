import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { buildThemes } from "./build-themes.mjs";
const themes = JSON.parse(
  readFileSync(new URL("../src/themes/themes.json", import.meta.url))
);
const key = "guesstimate.appearance.theme";
function environment({ saved, dark = false, blocked = false } = {}) {
  let value = saved;
  const events = new Map(),
    mediaEvents = new Map();
  const document = { documentElement: { dataset: {}, style: {} } };
  const media = {
    matches: dark,
    addEventListener: (name, fn) => mediaEvents.set(name, fn),
  };
  const window = {
    matchMedia: () => media,
    addEventListener: (name, fn) => events.set(name, fn),
    dispatchEvent() {},
  };
  const localStorage = {
    getItem() {
      if (blocked) throw Error();
      return value;
    },
    setItem(_, v) {
      if (blocked) throw Error();
      value = v;
    },
  };
  vm.runInNewContext(
    readFileSync(new URL("../public/theme.js", import.meta.url), "utf8"),
    { window, document, localStorage, Event }
  );
  return {
    root: document.documentElement,
    set: window.guesstimateTheme.setPreference,
    system(dark) {
      media.matches = dark;
      mediaEvents.get("change")();
    },
    storage(v) {
      value = v;
      events.get("storage")({ key });
    },
    clear() {
      value = null;
      events.get("storage")({ key: null });
    },
  };
}
test("system follows OS; an explicit choice ignores subsequent OS changes", () => {
  const e = environment({ dark: true });
  assert.equal(e.root.dataset.theme, "dark");
  e.system(false);
  assert.equal(e.root.dataset.theme, "light");
  e.set("dark");
  e.system(false);
  assert.equal(e.root.dataset.theme, "dark");
  e.set("system");
  assert.equal(e.root.dataset.theme, "light");
});
test("saved choice is applied immediately, including its native color scheme", () => {
  const e = environment({ saved: "dark" });
  assert.equal(e.root.dataset.theme, "dark");
  assert.equal(e.root.style.colorScheme, "dark");
});
test("invalid saved values fall back to system and invalid requests are ignored", () => {
  const e = environment({ saved: "missing", dark: true });
  assert.equal(e.root.dataset.theme, "dark");
  assert.equal(e.set("missing"), false);
  assert.equal(e.root.dataset.themePreference, "system");
});
test("storage failures keep live in-memory switching", () => {
  const e = environment({ blocked: true });
  assert.equal(e.set("dark"), false);
  assert.equal(e.root.dataset.theme, "dark");
});
test("other-tab changes and clearing storage update the theme", () => {
  const e = environment();
  e.storage("dark");
  assert.equal(e.root.dataset.theme, "dark");
  e.clear();
  assert.equal(e.root.dataset.themePreference, "system");
  assert.equal(e.root.dataset.theme, "light");
});
test("every registered theme supplies the same semantic roles and generated selectors", () => {
  buildThemes();
  const css = readFileSync(
    new URL("../public/themes.css", import.meta.url),
    "utf8"
  );
  for (const [id, theme] of Object.entries(themes)) {
    assert.deepEqual(
      Object.keys(theme.colors).sort(),
      Object.keys(themes.light.colors).sort()
    );
    assert.ok(css.includes(`[data-theme="${id}"]`));
    for (const value of Object.values(theme.colors))
      assert.match(value, /^#[\da-f]{6}([\da-f]{2})?$/i);
  }
});
