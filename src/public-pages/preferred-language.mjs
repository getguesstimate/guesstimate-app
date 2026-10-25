// The locale registry is shared with the static page generator.
export function preferredLanguage(locales, savedLanguage, acceptLanguage = "") {
  const saved = locales.find((locale) => locale.code === savedLanguage);
  if (saved) return saved;

  const preferences = acceptLanguage
    .split(",")
    .map((entry) => {
      const [tag, ...parameters] = entry.trim().toLowerCase().split(";");
      const quality = parameters
        .map((part) => part.trim())
        .find((part) => part.startsWith("q="));
      return {
        tag,
        quality: quality === undefined ? 1 : Number(quality.slice(2)),
      };
    })
    .filter(({ quality }) => quality > 0 && quality <= 1)
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of preferences) {
    const match =
      locales.find((locale) => locale.code.toLowerCase() === tag) ||
      locales.find(
        (locale) =>
          locale.code.toLowerCase().split("-")[0] === tag.split("-")[0]
      );
    if (match) return match;
  }
  return locales.find((locale) => locale.code === "en");
}
