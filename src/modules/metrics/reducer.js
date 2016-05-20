// TODO(matthew): Dry up code here (see guesstimate reducer), make this copying not necessary.
function uniq(items) {
  return _.uniqBy(items.slice().reverse(), 'id').reverse()
}

function spaceToMetrics(space) {
  let metrics = _.get(space, 'graph.metrics')
  return _.isEmpty(metrics) ? [] : metrics.map(m => ({...m, space: space.id}))
}

export default function metrics(state = [], action) {
  switch (action.type) {
  case 'SPACES_FETCH_SUCCESS':
    const newMetrics = (_.flatten(action.records.map(e => spaceToMetrics(e))).filter(e => e))
    return uniq([...state, ...newMetrics])
  case 'ADD_METRIC':
    const res = (uniq([...state, action.item]))
    debugger
    return res
  case 'REMOVE_METRIC':
    console.log("Removing Metric")
    return (state.filter(y => y.id !== action.item.id))
  case 'CHANGE_METRIC':
    const i = state.findIndex(y => y.id === action.item.id)
    const newItem = Object.assign({}, state[i], action.item)
    if (i !== -1) {
      return ([
        ...state.slice(0, i),
        newItem,
        ...state.slice(i+1, state.length)
      ])
    }
  default:
    return state
  }
}

