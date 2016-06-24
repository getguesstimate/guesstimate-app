import app from 'ampersand-app'

export function navigate(url) {
  if (url) { app.router.history.navigate(url)}
}

export function navigateFn(url) { return () => {navigate(url)} }
