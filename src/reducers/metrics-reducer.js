class Metrics{
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
  {id: '238jd', readableId: 'CO', name: 'cowboys', value: '100/4', guesstimate: {estimate: {median: 100, stdev: 4}}, location: {column: 3, row: 3}},
  {id: 'sd8f', readableId: 'BA', name: 'batmen', value: '1/1', guesstimate: {estimate: {median: 1, stdev: 1}}, location: {column: 1, row: 0}},
  {id: 's18f3', readableId: 'PO', name: 'police', value: '50/3', guesstimate: {estimate: {median: 50, stdev: 3}}, location: {column: 1, row: 2}}
]

export default function metrics(state = initialMetrics, action) {
  switch (action.type) {
  case 'ADD_METRIC':
    return (new Metrics(state)).add({location: action.location, id: action.id}).state
  case 'REMOVE_METRIC':
    return (new Metrics(state)).remove(action.id).state
  case 'CHANGE_METRIC':
    let values = action.values
    if ('name' in values){
      values.readableId = values.name.substring(0,3).toUpperCase()
    }
    return (new Metrics(state)).update(action.id, values).state
  default:
    return state
  }
}

