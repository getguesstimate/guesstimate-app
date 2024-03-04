import * as Sentry from "@sentry/nextjs";

export function captureException(
  e: unknown,
  metadata: Parameters<typeof Sentry.captureException>[1]
) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(e, metadata);
  } else {
    console.log("exception", e, metadata);
  }
}

export function captureMessage(message: string, tags: Record<string, any>) {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.captureMessage(message, { tags });
  } else {
    console.log("captureMessage", message, tags);
  }
}
