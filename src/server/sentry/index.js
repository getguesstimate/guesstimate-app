import { API_KEY } from "./constants.js";
import Raven from "raven-js";

export function initialize() {
  if (__API_ENV__ !== "development") {
    Raven.config(`https://${API_KEY}@app.getsentry.com/60378`).install();
  }
}

export function trackUser(userId, info) {
  if (__API_ENV__ !== "development") {
    Raven.setUserContext({ userId, ...info });
  }
}

export function captureException(e, metadata) {
  if (__API_ENV__ === "development") {
    console.log("exception", e, metadata);
  } else {
    Raven.captureException(e, metadata);
  }
}

export function captureMessage(message, metadata) {
  if (__API_ENV__ === "development") {
    console.log("captureMessage", message, metadata);
  } else {
    Raven.captureMessage(message, { tags: metadata });
  }
}
