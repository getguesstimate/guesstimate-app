export const actions = {
  formFetchStart: 'FIRST_SUBSCRIPTION_IFRAME_FETCH_START',
  unnecessary: 'FIRST_SUBSCRIPTION_FLOW_UNNECESSARY',
  reset: 'FIRST_SUBSCRIPTION_FLOW_RESET',
  cancel: 'FIRST_SUBSCRIPTION_FLOW_CANCEL',
  synchronizationPostStart: 'FIRST_SUBSCRIPTION_SYNCHRONIZATION_POST_START'
}

export const states = {
  unnecessary: 'UNNECESSARY',
  start: 'START',
  cancelled: 'CANCELLED',
  form: 'FORM',
  synchronization: 'SYNCHRONIZATION'
}

export function newFlowState(state, type) {
  if (type === actions.unnecessary) {
    return states.unnecessary
  }
  if (state === states.start) {
    switch (type) {
      case actions.formFetchStart:
        return states.form
    }
  }
  if (state === states.cancelled) {
    switch (type) {
      case actions.reset:
        return states.start
    }
  }
  if (state === states.form) {
    switch (type) {
      case actions.synchronizationPostStart:
        return states.synchronization
      case actions.reset:
        return states.start
      case actions.cancel:
        return states.cancelled
    }
  }
  if (state === states.synchronization) {
    switch (type) {
      case actions.reset:
        return states.unencessary
    }
  }
  return state
}

export function subState({flowState, iframe, synchronization}) {
  if (flowState === states.form) {
    return `FORM_${iframe.request.status}`
  }
  else if (flowState === states.synchronization) {
    return `SYNCHRONIZATION_${synchronization.request.status}`
    }
  else { return flowState }
}
