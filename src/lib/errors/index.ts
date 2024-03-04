import * as sentry from "~/server/sentry/index";

export function captureApiError(
  locationName: string,
  err: unknown,
  params: any
) {
  const errorParams = {
    locationName,
    errorThrown: String(err),
    ...params,
  };
  sentry.captureMessage(`AJAX Error - ${locationName}`, errorParams);
}

export function searchError(name: string, e: unknown) {
  sentry.captureException(e, { tags: name });
}
