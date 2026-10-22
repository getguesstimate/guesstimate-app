const menu = document.querySelector(".mobile-menu");
const headerMenus = [...document.querySelectorAll(".site-header details")];
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
