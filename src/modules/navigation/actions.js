import app from 'ampersand-app'

export function navigate(url, opts={}) {
  if (url) { app.router.history.navigate(url, opts)}
}

export function navigateFn(url, opts={}) { return () => {navigate(url, opts)} }
