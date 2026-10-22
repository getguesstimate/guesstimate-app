import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  locales,
  menuLocalesFor,
  renderPublicPages,
  publicPageRewrites,
  validateTranslations,
} from "./build-public-pages.mjs";
const allPages = renderPublicPages();
const pages = allPages.filter((page) =>
  ["index", "pricing"].includes(page.name)
);
const english = JSON.parse(
  readFileSync(
    new URL("../src/public-pages/locales/en.json", import.meta.url),
    "utf8"
  )
);
const footerOf = (html) =>
  html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)[0];

test("generates both pages for every locale with correct routes and direction", () => {
  assert.deepEqual(
    pages.map((p) => p.route),
    locales.flatMap(({ prefix }) => [prefix || "/", `${prefix}/pricing`])
  );
  assert.deepEqual(
    publicPageRewrites().map((r) => r.source),
    allPages.map((p) => p.route)
  );
  for (const page of pages) {
    assert(
      page.html.includes(
        `<html lang="${page.locale}" dir="${
          locales.find((locale) => locale.code === page.locale).dir
        }">`
      )
    );
    assert(
      page.html.includes(
        `href="https://www.getguesstimate.com${page.route}" rel="canonical"`
      )
    );
    assert.equal((page.html.match(/hreflang="x-default"/g) || []).length, 1);
  }
});
test("language links keep the visitor on the equivalent page", () => {
  for (const page of pages) {
    const menu = page.html.match(
      /<details class="language-menu">[\s\S]*?<\/details>/
    )[0];
    const suffix = page.name === "index" ? "" : "/pricing";
    for (const locale of locales) {
      assert(
        menu.includes(
          `href="${locale.prefix + suffix || "/"}" lang="${locale.code}"`
        )
      );
      assert(menu.includes(`<bdi dir="auto">${locale.name}</bdi>`));
    }
    assert(!/<a[^>]+ dir=/.test(menu));
    assert.equal((menu.match(/aria-current="true"/g) || []).length, 1);
    assert(!menu.includes('aria-current="page"'));
  }
});
test("shared footer is consistent and both navigation menus mark Plans correctly", () => {
  for (const { code: locale } of locales) {
    const [home, pricing] = pages.filter((p) => p.locale === locale);
    assert.equal(footerOf(home.html), footerOf(pricing.html));
    for (const page of [home, pricing]) {
      const header = page.html.match(
        /<header class="site-header">[\s\S]*?<\/header>/
      )[0];
      assert.equal(
        (header.match(/aria-current="page"/g) || []).length,
        page.name === "pricing" ? 2 : 0
      );
      assert(!header.includes('href="/scratchpad"'));
    }
  }
});
test("missing translations and changed interpolation tokens fail instead of mixing languages", () => {
  const missing = { ...english };
  delete missing["nav.plans"];
  assert.throws(
    () => validateTranslations(missing, english, "test"),
    /Missing translation/
  );
  const changed = { ...english, "plan.individual.limit": "No placeholder" };
  assert.throws(
    () => validateTranslations(changed, english, "test"),
    /placeholders differ/
  );
});
test("complete HTML has no unresolved translations or app hydration, and formulas stay LTR", () => {
  for (const { html, name } of allPages) {
    assert(!/\{\{[^{}]+\}\}/.test(html));
    assert(!html.includes("__NEXT_DATA__"));
    assert(html.includes('<script src="/site.js" defer></script>'));
    assert.equal((html.match(/<main\b/g) || []).length, 1);
    if (name === "index") {
      assert(html.includes('<code dir="ltr">= A * B</code>'));
      assert(html.includes("ua8kd9n06a"));
    }
  }
});

test("locale identifiers and paths are unique, with simple language labels", () => {
  assert.equal(new Set(locales.map((l) => l.code)).size, locales.length);
  assert.equal(new Set(locales.map((l) => l.prefix)).size, locales.length);
  assert.equal(locales.find((l) => l.code === "pt-BR").name, "Português");
  assert.equal(locales.find((l) => l.code === "zh-Hans").name, "中文");
  for (const locale of locales) {
    assert.doesNotThrow(() => new Intl.Locale(locale.code));
    assert(["ltr", "rtl"].includes(locale.dir));
  }
});

test("language menu sorts by translated names while displaying native names only", () => {
  assert.deepEqual(
    menuLocalesFor("en").map((locale) => locale.code),
    [
      "ar",
      "zh-Hans",
      "en",
      "fr",
      "de",
      "el",
      "he",
      "hi",
      "it",
      "ja",
      "ko",
      "pt-BR",
      "ru",
      "es",
    ]
  );
  assert.notDeepEqual(menuLocalesFor("he"), menuLocalesFor("en"));
  for (const { html, locale } of pages) {
    const menu = html.match(
      /<details class="language-menu">[\s\S]*?<\/details>/
    )[0];
    const links = [
      ...menu.matchAll(/<a [^>]*hreflang="([^"]+)"[^>]*>(.*?)<\/a>/g),
    ];
    const names = new Intl.DisplayNames([locale], { type: "language" });
    const collator = new Intl.Collator(locale, { sensitivity: "base" });
    const translated = links.map(([, code]) =>
      names.of(new Intl.Locale(code).language)
    );
    assert.deepEqual(translated, [...translated].sort(collator.compare));
    assert.equal(links.length, locales.length);
    for (const [, code, content] of links) {
      assert.equal(
        content,
        `<bdi dir="auto">${
          locales.find((item) => item.code === code).name
        }</bdi>`
      );
    }
  }
});
