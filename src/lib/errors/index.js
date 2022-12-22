import * as sentry from "servers/sentry/index";

export function captureApiError(
  locationName,
  jqXHR,
  textStatus,
  errorThrown,
  params
) {
  const { responseText, statusText, status } = jqXHR;
  const errorParams = {
    errorThrown,
    locationName,
    textStatus,
    statusText,
    status,
    ...params,
  };
  sentry.captureMessage(`AJAX Error - ${locationName}`, errorParams);
}

export function searchError(name, e) {
  sentry.captureException(e, name);
}

export function generalError(name, params) {
  sentry.captureMessage(name, params);
}
