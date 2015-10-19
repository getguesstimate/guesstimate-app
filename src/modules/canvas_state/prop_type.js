import {PropTypes} from 'react';

export default PropTypes.shape({
  userAction: PT.oneOf([
    'selecting',
    'function',
    'estimate',
    'editing'
  ]).isRequired,
  metricCardView: PT.oneOf([
    'normal',
    'scientific',
    'debugging',
  ]).isRequired,
})
