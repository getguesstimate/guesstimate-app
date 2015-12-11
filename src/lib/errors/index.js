import * as sentry from '../../server/sentry/index.js'

export function captureApiError(locationName, jqXHR, textStatus, errorThrown, params){
  const {responseText, statusText, status} = jqXHR
  const errorParams = {errorThrown, locationName, textStatus, statusText, status, ...params}
  sentry.captureMessage(`AJAX Error - ${locationName}`, errorParams)
  console.error(`AJAX Error - ${locationName}`, errorParams)
}

export function searchError(name, e){
  sentry.captureException(e, name)
  console.error(`AlgoliaError ${name}`, e)
}

export function generalError(name, params){
  console.error('generalError', name, params)
  sentry.captureMessage(name, params)
}
