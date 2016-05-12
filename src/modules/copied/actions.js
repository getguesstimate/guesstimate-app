import e from 'gEngine/engine'
import * as metricActions from 'gModules/metrics/actions'
import {multipleSelect} from 'gModules/multiple_selection/actions'
import {deSelect} from 'gModules/selection/actions'

function isWithinRegion(location, region) {
  return (
    location.row >= region[0].row &&
    location.row <= region[1].row &&
    location.column >= region[0].column &&
    location.column <= region[1].column
  )
}

function translateLocation(location, block, withinBlockLocation) {
  const translate = l => ({row: l.row + (location.row - block[0].row), column: l.column + location.column - block[0].column})
  return translate(withinBlockLocation)
}

// Translates a region to have the upper left corner at location
function translateBlock(location, block) {
  const translate = l => ({row: l.row + (location.row - block[0].row), column: l.column + location.column - block[0].column})
  return [location, translate(block[1])]
}

export function copy(spaceId){
  return (dispatch, getState) => {
    const state = getState()

    const region = state.multipleSelection
    const metrics = state.metrics.filter(m => m.space === spaceId && isWithinRegion(m.location, region))
    const guesstimates = metrics.map(metric => state.guesstimates.find(g => g.metric === metric.id))

    dispatch({type: "COPY", copied: {metrics, guesstimates, block: region}})
  }
}

export function paste(spaceId){
  return (dispatch, getState) => {
    const state = getState()
    if (!(state.copied && state.selection)) { return }

    const {metrics, guesstimates, block} = state.copied
    const location = state.selection
    const pasteRegion = translateBlock(location, block)

    const spaceMetrics = getState().metrics.filter(m => m.space === spaceId)
    let existingReadableIds = spaceMetrics.map(m => m.readableId)

    let newItems = []
    for (let metric of metrics) {
      const newMetric = Object.assign(
        {},
        metric,
        e.metric.create(existingReadableIds),
        {location: translateLocation(location, block, metric.location)}
      )
      newItems.push(newMetric)
      existingReadableIds.push(newMetric.readableId)
    }

    const newGuesstimates = _.map(guesstimates, (guesstimate, i) => Object.assign({}, guesstimate, {metric: newItems[i].id}))

    const existingMetrics = spaceMetrics.filter(m => isWithinRegion(m.location, pasteRegion))
    if (existingMetrics.length > 0) {
      _.map(existingMetrics, existingMetric => {dispatch(metricActions.removeMetric(existingMetric.id))})
    }

    _.map(newItems, (newItem, i) => {
      dispatch({ type: 'ADD_METRIC', item: newItem, newGuesstimate: newGuesstimates[i] })
      dispatch({ type: 'RUN_FORM_SIMULATIONS', getState, dispatch, metricId: newItem.id })
    })

    dispatch(multipleSelect(pasteRegion[0], pasteRegion[1]))
    //dispatch(deSelect()) Nope. TODO this defocuses the canvas. Why????
  }
}
