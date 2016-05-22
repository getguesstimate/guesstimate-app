import {deleteSimulations} from 'gModules/simulations/actions'

import engine from 'gEngine/engine'

export function saveCheckpoint(spaceId, newGraph) {
  return (dispatch, getState) => {
    dispatch({type: 'SAVE_CHECKPOINT', checkpoint: newGraph, spaceId})
  }
}

export function initSpace(spaceId, graph) {
  return (dispatch, getState) => {
    const {metrics, guesstimates} = graph
    dispatch({type: 'INITIALIZE', checkpoint: {guesstimates, metrics: metrics.map(m => Object.assign({}, m, {space: spaceId}))}, spaceId})
  }
}

function updateMetricsAndGuesstimates(
  dispatch,
  getState,
  spaceId,
  oldMetrics,
  newMetrics,
  oldGuesstimates,
  newGuesstimates
) {
  const metricsToAdd = newMetrics.filter(m => !_.some(oldMetrics, o => o.id === m.id))
  const metricsToDelete = oldMetrics.filter(m => !_.some(newMetrics, n => n.id === m.id))
  const metricsToModify = newMetrics.filter(m => {
    const matchedMetric = _.find(oldMetrics, o => o.id === m.id)
    if (!matchedMetric) { return false }
    const oldGuesstimate = _.find(oldGuesstimates, g => g.metric === matchedMetric.id)
    const newGuesstimate = _.find(newGuesstimates, g => g.metric === m.id)
    return (
      !engine.metric.equals(matchedMetric, m) ||
      !engine.guesstimate.equals(oldGuesstimate, newGuesstimate)
    )
  })

  const guesstimatesToAdd = newGuesstimates.filter(g => _.some(metricsToAdd, m => m.id === g.metric))
  const guesstimatesToModify = newGuesstimates.filter(g => _.some(metricsToModify, m => m.id === g.metric))

  dispatch({type: 'ADD_METRICS', items: metricsToAdd, newGuesstimates: guesstimatesToAdd})
  dispatch({type: 'REMOVE_METRICS', item: {ids: metricsToDelete.map(m => m.id)}})
  metricsToModify.forEach(m => { dispatch({ type: 'CHANGE_METRIC', item: m }) })
  guesstimatesToModify.forEach(g => {
    const formatted = engine.guesstimate.format(g)
    dispatch({ type: 'CHANGE_GUESSTIMATE', metricId: g.metric, values: formatted })
  })
  dispatch(deleteSimulations(guesstimatesToModify.map(g => g.metric)))

  dispatch({type: 'RUN_UNDO_SIMULATIONS', getState, dispatch, spaceId})
}

export function undo(spaceId) {
  return (dispatch, getState) => {
    const spaceCheckpoints = getState().checkpoints.find(r => r.spaceId === spaceId)
    if (!spaceCheckpoints) { return }

    const {head, checkpoints} = spaceCheckpoints
    if (head === checkpoints.length - 1) { return }
    const newGraph = checkpoints[head+1]
    const {metrics, guesstimates} = getState()
    updateMetricsAndGuesstimates(dispatch, getState, spaceId, metrics, newGraph.metrics, guesstimates, newGraph.guesstimates)

    dispatch({type: 'UPDATE_FOR_SPACE', spaceId, newCheckpoints: {spaceId, head: head+1, checkpoints}})
  }
}

export function redo(spaceId) {
  return (dispatch, getState) => {
    const {head, checkpoints} = getState().checkpoints.find(r => r.spaceId === spaceId)
    if (head === 0) { return }
    const newGraph = checkpoints[head-1]
    const {metrics, guesstimates} = getState()
    updateMetricsAndGuesstimates(dispatch, getState, spaceId, metrics, newGraph.metrics, guesstimates, newGraph.guesstimates)

    dispatch({type: 'UPDATE_FOR_SPACE', spaceId, newCheckpoints: {spaceId, head: head-1, checkpoints}})
  }
}
