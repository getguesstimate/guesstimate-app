import {PropTypes} from 'react';
const PT = PropTypes

export const canvasState = PT.shape({
  metricCardView,
  metricClickMode
})

export const metricCardView = PT.oneOf([
  'normal',
  'scientific',
  'analysis',
  'display'
]).isRequired

export const metricClickMode = PT.oneOf([
  'DEFAULT',
  'FUNCTION_INPUT_SELECT'
])

export const edgeView = PT.oneOf([
    'hidden',
    'visible'
])

export const saveState = PT.oneOf([
    'NONE',
    'SAVING',
    'ERROR',
    'SAVED'
])

export const analysisMetricId = PT.string

export default PropTypes.shape({
  edgeView: edgeView.isRequired,
  metricCardView: metricCardView.isRequired,
  metricClickMode: metricClickMode.isRequired,
  saveState: saveState.isRequired,
  analysisMetricId: analysisMetricId.isRequired,
})
