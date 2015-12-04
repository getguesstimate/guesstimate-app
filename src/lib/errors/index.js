import * as sentry from '../../server/sentry/index.js'

export function captureApiError(locationName, jqXHR, textStatus, errorThrown, params){
  const {responseText, statusText, status} = jqXHR
  const errorParams = {errorThrown, locationName, textStatus, statusText, status, ...params}
  sentry.captureMessage(`AJAX Error - ${locationName}`, errorParams)
  console.log(`AJAX Error - ${locationName}`, errorParams)
}

