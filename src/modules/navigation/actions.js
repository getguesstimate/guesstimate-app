import app from "ampersand-app";

export function navigate(url, opts = {}) {
  if (url) {
    app.router.history.navigate(url, opts);
  }
}

export function externalNavigate(url) {
  const win = window.open(url, "_blank");
  win.focus();
}

export function navigateFn(url, opts = {}) {
  return () => {
    navigate(url, opts);
  };
}
