import { combineReducers } from 'redux';
import metricModel from '../models/metric'

export function changeSelect(location) {
  return { type: 'CHANGE_SELECT', location };
}

export function addMetric(location) {
  return { type: 'ADD_METRIC', location};
}

export function removeMetric(metric) {
  return { type: 'REMOVE_METRIC', metric};
}

let initialMetrics = [{id: 1, location: {column: 3, row: 3}}]

export default function metrics(state = initialMetrics, action) {
  switch (action.type) {
  case 'ADD_METRIC':
    let newModel = new metricModel({location: action.location})
    return [...state, newModel.toJSON()]
  case 'REMOVE_METRIC':
    let metric = action.metric
    let newItems = state.filter(function(i) {
      let isSame = (i.location.column == metric.location.column) && (i.location.row == metric.location.row)
      return !isSame
     })
    return newItems
  default:
    return state
  }
}

export default function selection(state = {column: 1, row: 1}, action) {
  switch (action.type) {
  case 'CHANGE_SELECT':
    return action.location;
  case 'ADD_METRIC':
    return action.location;
  default:
    return state
  }
}
const rootReducer = combineReducers({
  metrics,
  selection
});

export default rootReducer;
