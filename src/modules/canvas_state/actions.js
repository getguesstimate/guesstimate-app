import {presentOrVal} from 'gEngine/utils'

export const change = values => ({type: 'CHANGE_CANVAS_STATE', values})

export function clearEditsAllowed() {
  return (dispatch, getState) => {
    dispatch(changeActionState(''))
    dispatch(change({editsAllowed: null, editsAllowedManuallySet: false}))
  }
}

export function allowEdits() {
  return (dispatch, getState) => {
    dispatch(changeActionState(''))
    dispatch(change({editsAllowed: true, editsAllowedManuallySet: true}))
  }
}

export function forbidEdits(editsAllowedManuallySet = true) {
  return (dispatch, getState) => {
    dispatch(changeActionState(''))
    dispatch(change({editsAllowed: false, editsAllowedManuallySet: true}))
  }
}

export const changeMetricClickMode = clickMode => change({metricClickMode: presentOrVal(clickMode, 'DEFAULT')})
export const changeActionState = actionState => change({actionState})
export const analyzeMetricId = analysisMetricId => change({analysisMetricId})
export const endAnalysis = () => change({analysisMetricId: ''})
