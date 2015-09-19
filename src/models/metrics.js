import Metric from './metric.js';

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
    //let newModel = Object.assign({}, {name: '', value: ''}, values)
    let newModel = new Metric()
    this.state = [...this.state, newModel]
    return this
  }
  update(id, values){
    let newItem = Object.assign({}, this.get(id), values)
    return this.remove(id).add(newItem)
  }
  recalculate(id=this.needsRecalculation().id){
    let metric = this.get(id)
    let inputs = updateThis.inputReadableIds.map((id) => this.get({readableId: id}))
    inputs = this.state.filter
  }
  needsRecalculation(){
    return this.state.filter((m) => {m.needsUpdate()})[0];
  }
}

