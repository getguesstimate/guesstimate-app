import {PropTypes} from 'react';

export default PropTypes.shape({
  edgeView: PT.oneOf([
    'normal',
    'visible',
  ]).isRequired,
  metricCardView: PT.oneOf([
    'normal',
    'scientific',
    'debugging',
  ]).isRequired,
  metricClickMode: PT.oneOf([
    'DEFAULT',
    'FUNCTION_INPUT_SELECT'
  ]).isRequired,
})
