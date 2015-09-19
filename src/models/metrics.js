import Metric from './metric.js';
import _ from 'lodash'

export default class Metrics{
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
    let newModel = new Metric(values);
    this.state = [...this.state, newModel]
    return this
  }
  change(id, values){
    let metric = new Metric(this.get(id));
    return this.remove(id).add(metric.set(values).toStore());
  }
}

