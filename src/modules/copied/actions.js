import e from 'gEngine/engine'
import * as metricActions from 'gModules/metrics/actions'
import {multipleSelect} from 'gModules/multiple_selection/actions'
import {deSelect} from 'gModules/selection/actions'
import {runSimulations} from 'gModules/simulations/actions'

import {isWithinRegion, translate} from 'lib/locationUtils.js'

export function copy(spaceId){
  return (dispatch, getState) => {
    const state = getState()

    const region = state.multipleSelection
    const metrics = state.metrics.filter(m => m.space === spaceId && isWithinRegion(m.location, region))
    const guesstimates = metrics.map(metric => state.guesstimates.find(g => g.metric === metric.id))

    dispatch({type: "COPY", copied: {metrics, guesstimates, block: region}})
  }
}

function translateReadableIds(input, idMap) {
  if (!input) {return ""}
  const re = RegExp(Object.keys(idMap).join("|"), "g")
  return input.replace(re, (match) => idMap[match])
}

export function paste(spaceId){
  return (dispatch, getState) => {
    const state = getState()
    if (!(state.copied && state.selection)) { return }

    const {metrics, guesstimates, block} = state.copied
    const location = state.selection

    const translateFn = translate(block[0], location)

    const pasteRegion = [location, translateFn(block[1])]

    const spaceMetrics = state.metrics.filter(m => m.space === spaceId)
    let existingReadableIds = spaceMetrics.map(m => m.readableId)

    let readableIdsMap = {}
    const newMetrics = _.map(metrics, metric => {
      const newMetric = Object.assign(
        {},
        metric,
        e.metric.create(existingReadableIds),
        {location: translateFn(metric.location)}
      )
      existingReadableIds.push(newMetric.readableId)
      readableIdsMap[metric.readableId] = newMetric.readableId
      return newMetric
    })

    const newGuesstimates = _.map(
      guesstimates,
      (guesstimate, i) => Object.assign(
        {},
        guesstimate,
        {metric: newMetrics[i].id},
        {input: translateReadableIds(guesstimate.input, readableIdsMap)}
      )
    )

    const existingMetrics = spaceMetrics.filter(m => isWithinRegion(m.location, pasteRegion))
    existingMetrics.forEach(existingMetric => {dispatch(metricActions.removeMetric(existingMetric.id))})

    newMetrics.forEach((newItem, i) => {dispatch({type: 'ADD_METRIC', item: newItem, newGuesstimate: newGuesstimates[i]})})

    dispatch(runSimulations({spaceId, onlyMetrics: newMetrics}))
    dispatch(multipleSelect(pasteRegion[0], pasteRegion[1]))
  }
}
