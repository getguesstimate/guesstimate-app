import { combineReducers } from 'redux';
import metricModel from '../models/metric'
import _ from 'lodash'
var uuid = require('node-uuid')

export function changeSelect(location) {
  return { type: 'CHANGE_SELECT', location };
}

export function addMetric(location) {
  return { type: 'ADD_METRIC', location};
}

export function removeMetric(id) {
  return { type: 'REMOVE_METRIC', id};
}

export function changeMetric(id, values) {
  return { type: 'CHANGE_METRIC', id, values };
}

let initialMetrics = [{id: '1', name: 'foobar', value: '39339', location: {column: 3, row: 3}}]

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
    let existing = this.state.map((e) => e.id)
    console.log(existing)
    let newId = (Math.max(...existing) + 1).toString()
    let newModel = Object.assign({}, {id: newId, name: '', value: ''}, values)
    this.state = [...this.state, newModel]
    return this
  }
  update(id, values){
    let newItem = Object.assign({}, this.get(id), values)
    return this.remove(id).add(newItem)
  }
}

export default function metrics(state = initialMetrics, action) {
  switch (action.type) {
  case 'ADD_METRIC':
    return (new Models(state)).add({location: action.location}).state
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
const rootReducer = combineReducers({
  metrics,
  selection
});

export default rootReducer;
