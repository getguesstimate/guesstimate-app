import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
import process from "node:process";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(resolve(projectRoot, path), "utf8");
export const locales = JSON.parse(read("src/public-pages/locales.json"));
// Sort by translated language names, but render only the native names below.
export function menuLocalesFor(language) {
  const names = new Intl.DisplayNames([language], { type: "language" });
  const collator = new Intl.Collator(language, { sensitivity: "base" });
  const sortName = (locale) => names.of(new Intl.Locale(locale.code).language);
  return [...locales].sort((a, b) =>
    collator.compare(sortName(a), sortName(b))
  );
}
const planData = JSON.parse(read("src/public-pages/plan-data.json"));
const pages = [
  { name: "index", route: "/" },
  { name: "pricing", route: "/pricing" },
];
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[character])
  );
const urlFor = (locale, page) =>
  locale.prefix +
  (page.route === "/" ? (locale.prefix ? "" : "/") : page.route);

const pagesFor = (locale) =>
  pages.filter((page) => !page.englishOnly || locale.code === "en");

export function publicPageRewrites() {
  return locales.flatMap((locale) =>
    pagesFor(locale).map((page) => ({
      source: urlFor(locale, page),
      destination: `${locale.prefix}/${page.name}.html`,
    }))
  );
}

export function validateTranslations(messages, english, language) {
  for (const key of Object.keys(english)) {
    if (typeof messages[key] !== "string" || !messages[key].trim()) {
      throw new Error(`Missing translation: ${language}.${key}`);
    }
    const tokens = (text) =>
      [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    if (
      JSON.stringify(tokens(messages[key])) !==
      JSON.stringify(tokens(english[key]))
    ) {
      throw new Error(`Translation placeholders differ: ${language}.${key}`);
    }
  }
  for (const key of Object.keys(messages)) {
    if (!(key in english))
      throw new Error(`Unknown translation: ${language}.${key}`);
  }
}

// Complete HTML is generated for each locale; the browser never loads translations.
export function renderPublicPages() {
  const english = JSON.parse(read("src/public-pages/locales/en.json"));
  const partial = (name) =>
    read(`src/public-pages/partials/${name}.html`).trimEnd();
  return locales.flatMap((locale) => {
    const messages = JSON.parse(
      read(`src/public-pages/locales/${locale.code}.json`)
    );
    validateTranslations(messages, english, locale.code);
    const number = (value) => new Intl.NumberFormat(locale.code).format(value);
    const money = (value) =>
      new Intl.NumberFormat(locale.code, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value);
    const data = Object.fromEntries(
      Object.entries(planData).map(([key, value]) => [
        key,
        `<bdi dir="ltr">${escapeHtml(
          key.endsWith("Price") || key === "average"
            ? money(value)
            : number(value)
        )}</bdi>`,
      ])
    );
    const simple = (key) => {
      if (!(key in messages))
        throw new Error(`Unknown translation key: ${key}`);
      return escapeHtml(messages[key]);
    };
    const inline = {
      ...data,
      range: '<code dir="ltr">40 to 60</code>',
      scratchpad: `<a href="/scratchpad">${simple("link.scratchpad")}</a>`,
      contact: `<a href="mailto:support@quantifieduncertainty.org">${simple(
        "link.contact"
      )}</a>`,
      quri: '<a href="https://quantifieduncertainty.org" dir="ltr">QURI</a>',
    };
    const translate = (key) =>
      simple(key).replace(/\{(\w+)\}/g, (_, token) => {
        if (!(token in inline))
          throw new Error(`Unknown placeholder: ${key}.${token}`);
        return inline[token];
      });
    const menuLocales = menuLocalesFor(locale.code);
    return pagesFor(locale).map((page) => {
      const currentUrl = urlFor(locale, page);
      const homeUrl = urlFor(locale, pages[0]);
      const pricingUrl = urlFor(locale, pages[1]);
      const languageMenu = page.englishOnly
        ? ""
        : `<details class="language-menu">
        <summary aria-label="${simple(
          "language.label"
        )}"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg><span lang="${
            locale.code
          }">${escapeHtml(locale.name)}</span></summary>
        <nav aria-label="${simple("language.label")}">${menuLocales
            .map(
              (other) =>
                `<a href="${urlFor(other, page)}" lang="${
                  other.code
                }" hreflang="${other.code}"${
                  other.code === locale.code ? ' aria-current="true"' : ""
                }><bdi dir="auto">${escapeHtml(other.name)}</bdi></a>`
            )
            .join("")}</nav>
      </details>`;
      const slots = {
        lang: locale.code,
        dir: locale.dir,
        homeUrl,
        pricingUrl,
        canonical: `https://www.getguesstimate.com${currentUrl}`,
        alternates: page.englishOnly
          ? ""
          : [
              ...locales.map(
                (other) =>
                  `<link rel="alternate" hreflang="${
                    other.code
                  }" href="https://www.getguesstimate.com${urlFor(
                    other,
                    page
                  )}" />`
              ),
              `<link rel="alternate" hreflang="x-default" href="https://www.getguesstimate.com${urlFor(
                locales[0],
                page
              )}" />`,
            ].join("\n"),
        languageMenu,
        languageNotice:
          locale.code === "en"
            ? ""
            : `<p class="language-notice">${simple("language.notice")}</p>`,
        videoLanguageNotice:
          locale.code === "en"
            ? ""
            : `<p class="note video-language-note">${simple(
                "video.notice"
              )}</p>`,
      };
      const replaceTokens = (source) =>
        source.replace(/\{\{([^{}]+)\}\}/g, (_, key) => {
          if (key.startsWith("t:")) return translate(key.slice(2));
          if (key.startsWith("data:")) {
            if (!(key.slice(5) in data))
              throw new Error(`Unknown data key: ${key}`);
            return data[key.slice(5)];
          }
          if (!(key in slots)) throw new Error(`Unknown template slot: ${key}`);
          return slots[key];
        });
      const header = replaceTokens(
        partial("header").replaceAll(
          'href="{{pricingUrl}}"',
          page.name === "pricing"
            ? 'href="{{pricingUrl}}" aria-current="page"'
            : 'href="{{pricingUrl}}"'
        )
      );
      const template = read(`src/public-pages/pages/${page.name}.html`);
      for (const slot of ["header", "footer"]) {
        if (template.split(`{{${slot}}}`).length !== 2)
          throw new Error(
            `${page.name}.html must contain exactly one {{${slot}}} slot`
          );
      }
      // Expand content before inserting shared partials, so translated braces are never re-evaluated.
      slots.header = header;
      slots.footer = replaceTokens(partial("footer"));
      const html = replaceTokens(template).replace(/[ \t]+$/gm, "");
      return {
        name: page.name,
        locale: locale.code,
        route: currentUrl,
        output: `${locale.prefix.slice(1)}${locale.prefix ? "/" : ""}${
          page.name
        }.html`,
        html,
      };
    });
  });
}

export function buildPublicPages() {
  for (const { output, html } of renderPublicPages()) {
    const path = resolve(projectRoot, "public", output);
    mkdirSync(dirname(path), { recursive: true });
    if (!existsSync(path) || readFileSync(path, "utf8") !== html)
      writeFileSync(path, html);
  }
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  buildPublicPages();
