import * as spaceActions from 'gModules/spaces/actions'

import engine from 'gEngine/engine'

export function changeGuesstimate(metricId, newGuesstimate, shouldRegisterGraphChange=true) {
  return (dispatch, getState) => {
    const state = getState()

    const metric = engine.metric.get(state.metrics, metricId)
    const space = engine.space.get(state.spaces, _.get(metric, 'space'))

    const possibleFacts = engine.space.possibleFacts(space, state, state.facts.organizationFacts)
    const factIdsMap = possibleFacts.reduce((map, curr) => _.set(map, `#${curr.variable_name}`, {id: curr.id, isMetric: false}), {})

    const metrics = state.metrics.filter(m => m.space === space.id)
    const metricIdsMap = metrics.reduce((map, curr) => _.set(map, curr.readableId, {id: curr.id, isMetric: true}), {})

    const readableIdsMap = {...metricIdsMap, ...factIdsMap}
    const expression = engine.guesstimate.inputToExpression(newGuesstimate.input, readableIdsMap)

    dispatch({ type: 'CHANGE_GUESSTIMATE', metricId, values: {...newGuesstimate, input: null, expression, metric: metricId} })

    if (shouldRegisterGraphChange && !!space) {
      dispatch(spaceActions.registerGraphChange(space.id))
    }
  }
}
