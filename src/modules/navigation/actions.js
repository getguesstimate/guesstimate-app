export function externalNavigate(url) {
  const win = window.open(url, "_blank");
  win.focus();
}
