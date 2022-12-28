export function externalNavigate(url: string) {
  const win = window.open(url, "_blank");
  win?.focus();
}
