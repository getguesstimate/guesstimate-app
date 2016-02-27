import app from 'ampersand-app'

export function navigate(url) {
  if (url) { app.router.history.navigate(url)}
}
