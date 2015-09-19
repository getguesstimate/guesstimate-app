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
  create(values){
    let newModel = new Metric(values);
    this._add(newModel.toStore());
    return this;
  }
  change(id, values){
    let metric = new Metric(this.get(id));
    this.remove(id)._add(metric.set(values).toStore());
    return this;
  }
  _add(newModel){
    this.state = [...this.state, newModel];
    return this;
  }
}

