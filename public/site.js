// Remember only deliberate language choices; visiting a shared link is not a preference.
for (const link of document.querySelectorAll(".language-menu a[hreflang]")) {
  link.addEventListener("click", () => {
    const language = link.getAttribute("hreflang");
    const secure = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `guesstimate.language=${encodeURIComponent(language)}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
  });
}

const menu = document.querySelector(".mobile-menu");
const headerMenus = [...document.querySelectorAll(".site-header details")];
const themeToggle = document.querySelector(".theme-toggle");
if (themeToggle && window.guesstimateTheme) {
  const modes = ["system", "light", "dark"];
  const updateThemeButton = () => {
    const preference = document.documentElement.dataset.themePreference;
    const mode = modes.includes(preference) ? preference : document.documentElement.dataset.theme;
    const label = themeToggle.getAttribute(`data-label-${mode}`);
    themeToggle.dataset.mode = mode;
    themeToggle.setAttribute("aria-label", label);
    themeToggle.title = label;
  };
  themeToggle.addEventListener("click", () => {
    const current = modes.indexOf(document.documentElement.dataset.themePreference);
    window.guesstimateTheme.setPreference(modes[(current + 1) % modes.length]);
  });
  window.addEventListener("guesstimate:theme-change", updateThemeButton);
  updateThemeButton();
  themeToggle.hidden = false;
}
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    for (const item of headerMenus) {
      if (item.open) {
        item.open = false;
        item.querySelector("summary").focus();
      }
    }
  }
});
document.addEventListener("click", (event) => {
  for (const item of headerMenus)
    if (!item.contains(event.target)) item.open = false;
});
matchMedia("(min-width: 761px)").addEventListener("change", (event) => {
  if (event.matches) menu.open = false;
});

const header = document.querySelector(".site-header");
const mobileViewport = matchMedia("(max-width: 760px)");
let lastScrollPosition = window.scrollY;
let scrollFrame = null;

function showHeader() {
  header.classList.remove("header-hidden");
  lastScrollPosition = window.scrollY;
}

function updateHeader() {
  scrollFrame = null;
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - innerHeight
  );
  const position = Math.max(0, Math.min(window.scrollY, maxScroll));

  if (
    !mobileViewport.matches ||
    position <= header.offsetHeight ||
    headerMenus.some((item) => item.open) ||
    header.querySelector(":focus-visible")
  ) {
    showHeader();
    return;
  }

  // Accumulate small movements so a slow scroll works without jitter.
  const distance = position - lastScrollPosition;
  if (Math.abs(distance) < 10) return;
  header.classList.toggle("header-hidden", distance > 0);
  lastScrollPosition = position;
}

window.addEventListener(
  "scroll",
  () => {
    if (scrollFrame === null) scrollFrame = requestAnimationFrame(updateHeader);
  },
  { passive: true }
);
header.addEventListener("focusin", showHeader);
for (const item of headerMenus) {
  item.addEventListener("toggle", showHeader);
}
mobileViewport.addEventListener("change", showHeader);
window.addEventListener("pageshow", (event) => {
  if (event.persisted) showHeader();
});
