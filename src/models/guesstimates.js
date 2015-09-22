import Guesstimate from './guesstimate';

export default class Guesstimates{
  constructor(state){
    this.state = _.cloneDeep(state)
  }
  remove(metricId){
    this.state = this.state.filter(function(i) {return i.metric !== metricId})
    return this;
  }
  get(metricId){
    return this.state.filter(function(i) {return i.metric === metricId})[0];
  }
  create(metricId){
    let newModel = new Guesstimate({metric: metricId});
    this._add(newModel.toStore());
    return this;
  }
  change(metricId, values){
    let metric = new Guesstimate(this.get(metricId));
    this.remove(metricId)._add(metric.set(values).toStore());
    return this;
  }
  _add(newModel){
    this.state = [...this.state, newModel];
    return this;
  }
}

