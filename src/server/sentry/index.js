import {API_KEY} from './constants.js'
import Raven from 'raven-js'

export function initialize() {
  Raven.config(`https://${API_KEY}@app.getsentry.com/60378`).install();
}

export function trackUser(userId, info) {
  Raven.setUserContext({userId, ...info})
}

export function captureException(e, metadata) {
  Raven.captureException(e, metadata)
}
