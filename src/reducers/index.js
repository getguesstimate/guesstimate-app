import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import _ from 'lodash'

import {addMetric, changeMetric} from '../actions/metric-actions.js'
import distributionForm from './distribution-form-reducer'
import selection from './selection-reducer'
import metrics from './metrics-reducer'

export function changeSelect(location) {
  return { type: 'CHANGE_SELECT', location };
}

const rootReducer = combineReducers({
  metrics,
  selection,
  distributionForm
});

export default rootReducer;
