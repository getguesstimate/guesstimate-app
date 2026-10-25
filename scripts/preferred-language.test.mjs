import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { preferredLanguage } from "../src/public-pages/preferred-language.mjs";

const locales = JSON.parse(
  readFileSync(
    new URL("../src/public-pages/locales.json", import.meta.url),
    "utf8"
  )
);
const choose = (header, saved) =>
  preferredLanguage(locales, saved, header).code;

test("manual choices take priority, including English", () => {
  assert.equal(choose("fr", "en"), "en");
  assert.equal(choose("en", "he"), "he");
  assert.equal(choose("fr", "invalid"), "fr");
});

test("browser preferences respect quality, regional variants and supported fallbacks", () => {
  assert.equal(choose("de;q=0.5,fr-CA;q=0.9,en;q=0.7"), "fr");
  assert.equal(choose("pl,he-IL;q=0.8,en;q=0.5"), "he");
  assert.equal(choose("pt-PT"), "pt-BR");
  assert.equal(choose("zh-CN"), "zh-Hans");
  assert.equal(choose("DE-de"), "de");
  assert.equal(choose("fr;q=0,de;q=0.8"), "de");
  assert.equal(choose("fr;q=garbage,de;q=2,es;q=0.5"), "es");
});

test("missing and unsupported languages fall back to English", () => {
  for (const header of ["", "pl", "*", "fr;q=0"])
    assert.equal(choose(header), "en");
});
