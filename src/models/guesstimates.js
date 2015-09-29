export default class Guesstimates{
  constructor(state){
    this.state = _.cloneDeep(state)
  }
  remove(metricId){
    this.state = this.state.filter(i => i.metric !== metricId)
    return this;
  }
  get(metricId){
    return this.state.find(i => i.metric === metricId);
  }
  change(values){
    this.remove(values.metricId)
    this._add(values)
    return this;
  }
  _add(newModel){
    this.state = [...this.state, newModel];
    return this;
  }
}

