import * as sentry from "servers/sentry/index";

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

export function searchError(name: string, e) {
  sentry.captureException(e, name);
}

export function generalError(name: string, params) {
  sentry.captureMessage(name, params);
}
