import { combineReducers } from 'redux';
import metricModel from '../models/metric'
import {addMetric, changeMetric} from '../actions/metric-actions.js'
import { reducer as formReducer } from 'redux-form';
import _ from 'lodash'
import InputToGuesstimate from '../lib/input-to-guesstimate'

export function changeSelect(location) {
  return { type: 'CHANGE_SELECT', location };
}

class Models{
  constructor(state){
   this.state = _.cloneDeep(state)
  }
  remove(id){
   this.state = this.state.filter(function(i) {return i.id !== id})
   return this
  }
  get(id){
   return this.state.filter(function(i) {return i.id === id})[0]
  }
  add(values){
    let newModel = Object.assign({}, {name: '', value: ''}, values)
    this.state = [...this.state, newModel]
    return this
  }
  update(id, values){
    let newItem = Object.assign({}, this.get(id), values)
    return this.remove(id).add(newItem)
  }
}

let initialMetrics = [
  {id: '8933', name: 'cowboys', value: '100', location: {column: 3, row: 3}},
  {id: 'sd8f', name: 'batmen', value: '1', location: {column: 1, row: 0}},
  {id: 's18f3', name: 'police', value: '50', location: {column: 1, row: 2}}
]

export default function metrics(state = initialMetrics, action) {
  switch (action.type) {
  case 'ADD_METRIC':
    return (new Models(state)).add({location: action.location, id: action.id}).state
  case 'REMOVE_METRIC':
    return (new Models(state)).remove(action.id).state
  case 'CHANGE_METRIC':
    return (new Models(state)).update(action.id, action.values).state
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

let guesstimate = null
export default function distributionForm(state = {}, action) {
  switch (action.type) {
  case 'CREATE_DISTRIBUTION_FORM':
    guesstimate = new InputToGuesstimate(action.value).toGuesstimate()
    return {input: action.value, guesstimate}
  case 'DESTROY_DISTRIBUTION_FORM':
    return {}
  return { type: 'ADD_METRIC_INPUT_TO_EDITING_METRIC', metric};
  case 'UPDATE_DISTRIBUTION_FORM':
    guesstimate = new InputToGuesstimate(action.value).toGuesstimate()
    return {input: action.value, guesstimate}
  case 'ADD_METRIC_INPUT_TO_DISTRIBUTION_FORM':
    let newInput = state.input + action.metric.id
    return Object.assign(state, {newInput: newInput})
  default:
    return state
  }
}

const rootReducer = combineReducers({
  metrics,
  selection,
  distributionForm
});

export default rootReducer;
