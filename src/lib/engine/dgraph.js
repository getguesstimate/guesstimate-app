import * as _guesstimate from './guesstimate'

const toEdges = dGraph => ({id, guesstimate}) => _guesstimate.inputMetrics(guesstimate, dGraph).map(i => ({output: id, input: i.id}))
export const dependencyMap = dGraph => _.isEmpty(dGraph) ? [] : _.flatten(dGraph.metrics.map(toEdges(dGraph)))
