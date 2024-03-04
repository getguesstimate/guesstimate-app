import { __API_ENV__ } from "~/lib/constants";

import * as Sentry from "@sentry/nextjs";

export function captureException(e, metadata) {
  if (__API_ENV__ === "development") {
    console.log("exception", e, metadata);
  } else {
    Sentry.captureException(e, metadata);
  }
}

export function captureMessage(message, metadata) {
  if (__API_ENV__ === "development") {
    console.log("captureMessage", message, metadata);
  } else {
    Sentry.captureMessage(message, { tags: metadata });
  }
}
