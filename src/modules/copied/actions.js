import e from 'gEngine/engine'
import * as metricActions from 'gModules/metrics/actions'
import {selectRegion} from 'gModules/selected_region/actions'
import {deSelect} from 'gModules/selected_cell/actions'
import {runSimulations} from 'gModules/simulations/actions'
import {registerGraphChange} from 'gModules/spaces/actions'

import {isLocation, isWithinRegion, translate} from 'lib/locationUtils.js'

export function cut(spaceId){
  return (dispatch, getState) => {
    dispatch(copy(spaceId))

    const state = getState()
    const region = state.selectedRegion
    const existingMetrics = state.metrics.filter(m => m.space === spaceId && isWithinRegion(m.location, region))
    if (existingMetrics.length > 0) {
      dispatch(metricActions.removeMetrics(existingMetrics.map(m => m.id)))
    }
  }
}

export function copy(spaceId){
  return (dispatch, getState) => {
    const state = getState()

    const region = state.selectedRegion
    const metrics = state.metrics.filter(m => m.space === spaceId && isWithinRegion(m.location, region))
    const guesstimates = metrics.map(metric => state.guesstimates.find(g => g.metric === metric.id))

    dispatch({type: "COPY", copied: {metrics, guesstimates, region}})
  }
}

export function paste(spaceId){
  return (dispatch, getState) => {
    const state = getState()
    if (!(state.copied && state.selectedCell && isLocation(state.selectedCell))) { return }

    const {metrics, guesstimates, region} = state.copied
    const location = state.selectedCell

    const translateFn = translate(region[0], location)

    const pasteRegion = [location, translateFn(region[1])]

    const spaceMetrics = state.metrics.filter(m => m.space === spaceId)
    let existingReadableIds = spaceMetrics.map(m => m.readableId)
    let existingIds = spaceMetrics.map(m => m.id)

    let idsMap = {}
    const newMetrics = _.map(metrics, metric => {
      let newMetric = {
        ...metric,
        ...e.metric.create(existingReadableIds),
        space: spaceId,
        location: translateFn(metric.location),
      }
      if (!_.some(existingReadableIds, id => id === metric.readableId)) { newMetric.readableId = metric.readableId }
      if (!_.some(existingIds, id => id === metric.id)) { newMetric.id = metric.id }

      existingReadableIds = [...existingReadableIds, newMetric.readableId]
      existingIds = [...existingIds, newMetric.id]
      idsMap[metric.id] = newMetric.id
      return newMetric
    })

    const newGuesstimates = _.map(
      guesstimates,
      (guesstimate, i) => Object.assign(
        {},
        guesstimate,
        {metric: newMetrics[i].id},
        {expression: e.utils.replaceByMap(guesstimate.expression, idsMap)}
      )
    )

    const existingMetrics = spaceMetrics.filter(m => isWithinRegion(m.location, pasteRegion))
    if (existingMetrics.length > 0) {
      dispatch(metricActions.removeMetrics(existingMetrics.map(m => m.id)))
    }
    if (newMetrics.length > 0) {
      dispatch({type: 'ADD_METRICS', items: newMetrics, newGuesstimates: newGuesstimates})
    }

    dispatch({type: "PASTE"})
    dispatch(runSimulations({spaceId, onlyUnsimulated: true}))
    dispatch(selectRegion(pasteRegion[0], pasteRegion[1]))
    dispatch(registerGraphChange(spaceId))
  }
}
