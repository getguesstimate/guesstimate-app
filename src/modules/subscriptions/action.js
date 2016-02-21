function actionType(action, event) {
  return `${action}/${event}`
}

function errorAction(action, error) {
  return {
      type: actionType(action, 'FAILURE'),
      error
  }
}

function successAction(action, value) {
  return {
      type: actionType(action, 'SUCCESS'),
      value
  }
}

function simpleCallback({dispatch, action}) {
  (err, value) => {
    if (err) { dispatch(errorAction(action, err)) }
    else if (value) { dispatch(successAction(action, value)) }
  }
}

export function fetch_subscription_iframe() {
  return (dispatch, getState) => {
    action = 'SUBSCRIPTION_IFRAME_FETCH'
    dispatch({type: actionType(action, 'START')})
    api(getState()).subscriptions.get_new_iframe(
      simpleCallback({dispatch, action})
    )
  }
}

export function fetch_first_subscription_iframe_url() {
  return (dispatch, getState) => {
    action = 'SUBSCRIPTION_PORTAL_FETCH'
    dispatch({type: actionType(action, 'START')})
    api(getState()).subscriptions.get_portal(
      simpleCallback({dispatch, action})
    )
}
