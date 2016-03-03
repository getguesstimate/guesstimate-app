import {PropTypes} from 'react';
const PT = PropTypes

export const canvasState = PT.shape({
  metricCardView,
  metricClickMode
})

export const metricCardView = PT.oneOf([
  'normal',
  'basic',
  'scientific',
  'display',
  'debugging',
]).isRequired

export const metricClickMode = PT.oneOf([
  'DEFAULT',
  'FUNCTION_INPUT_SELECT'
])

export default PropTypes.shape({
  edgeView: PT.oneOf([
    'normal',
    'visible',
  ]).isRequired,
  metricCardView: metricCardView.isRequired,
  metricClickMode: metricClickMode.isRequired,
  saveState: PT.oneOf([
    'NONE',
    'SAVING',
    'ERROR',
    'SAVED'
  ]).isRequired,
})
