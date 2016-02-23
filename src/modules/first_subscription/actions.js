import {setupGuesstimateApi} from 'servers/guesstimate-api/constants.js'

function api(state) {
  function getToken(state) {
    return _.get(state, 'me.token')
  }
  return setupGuesstimateApi(getToken(state))
}

function actionType(action, event) {
  return `${action}_${event}`
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
  return (err, value) => {
    if (err) { dispatch(errorAction(action, err)) }
    else if (value) { dispatch(successAction(action, value)) }
  }
}

export function fetchIframe({user_id, plan_id}) {
  return (dispatch, getState) => {
    const action = 'FIRST_SUBSCRIPTION_IFRAME_FETCH'

    dispatch({type: actionType(action, 'START')})
    api(getState()).subscriptions.get_new_iframe(
      {user_id, plan_id},
      simpleCallback({dispatch, action})
    )
  }
}

export function flowStageReset() {
  return {type: 'FIRST_SUBSCRIPTION_FLOW_RESET'}
}

export function flowStageCancel() {
  return {type: 'FIRST_SUBSCRIPTION_FLOW_CANCEL'}
}

export function flowStagePaymentSuccess() {
  return {type: 'FIRST_SUBSCRIPTION_FLOW_PAYMENT_SUCCESS'}
}

export function flowStageSynchronizationSuccess() {
  return {type: 'FIRST_SUBSCRIPTION_FLOW_SYNCHRONIZATION_SUCCESS'}
}
