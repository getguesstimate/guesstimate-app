// TODO(matthew): Dry up code here (see guesstimate reducer), make this copying not necessary.
function uniq(items) {
  return _.uniqBy(items.slice().reverse(), 'id').reverse()
}

function spaceToMetrics(space) {
  let metrics = _.get(space, 'graph.metrics')
  return _.isEmpty(metrics) ? [] : metrics.map(m => ({...m, space: space.id}))
}

export function metricsR(state = [], action) {
  switch (action.type) {
    case 'CALCULATORS_FETCH_SUCCESS': {
      const newMetrics = spaceToMetrics(_.get(action, 'data.space'))
      return uniq([...state, ...newMetrics])
    }
    case 'SPACES_FETCH_SUCCESS': {
      const newMetrics = (_.flatten(action.records.map(e => spaceToMetrics(e))).filter(e => e))
      return uniq([...state, ...newMetrics])
    }
    case 'SPACES_CREATE_SUCCESS': {
      if (!_.has(action, 'record.graph.metrics')) { return state }
      const newMetrics = spaceToMetrics(action.record).filter(e => e)
      return uniq([...state, ...newMetrics])
    }
    case 'ADD_METRIC':
      // TODO(matthew): Eliminate this (route everything through the multiple mode below).
      return (uniq([...state, action.item]))
    case 'ADD_METRICS':
      return (uniq([...state, ...action.items]))
    case 'REMOVE_METRICS':
      return (state.filter(y => !_.some(action.item.ids, id => y.id === id)))
    case 'CHANGE_METRIC':
      const i = state.findIndex(y => y.id === action.item.id);
      const newItem = Object.assign({}, state[i], action.item);
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

