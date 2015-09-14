import { combineReducers } from 'redux';
import metricModel from '../models/metric'
import {addMetric, changeMetric} from '../actions/metric-actions.js'
import { reducer as formReducer } from 'redux-form';
import _ from 'lodash'

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

let initialMetrics = [{id: '1', name: 'foobar', value: '39339', location: {column: 3, row: 3}}]

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

export default function distributionForm(state = {}, action) {
  switch (action.type) {
  case 'CREATE_DISTRIBUTION_FORM':
    return {input: action.value}
  case 'DESTROY_DISTRIBUTION_FORM':
    return {}
  case 'UPDATE_DISTRIBUTION_FORM':
    return {input: action.value}
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
