/* @flow */

import _ from 'lodash'

import * as graph from './graph';
import * as _guesstimate from './guesstimate';
import type {DGraph, Sample} from './types.js'

//borrowing a function from the graph library
const metric = graph.metric;

// TODO
// The guesstimate should denormalize if necessary
export function runSimulation(dGraph:DGraph, metricId:string, n:number): Sample{
  let m = metric(dGraph, metricId);
  return _guesstimate.sample(m.guesstimate, dGraph, n);
}

function metricInputs(metric, dGraph) {
  let inputs = _guesstimate.inputMetrics(metric.guesstimate, dGraph).map(m => m.id)
  return inputs.map( i => { return {output: metric.id, input: i} })
}

export function dependencyMap(dGraph: DGraph): Array<Object>{
  let asLists = dGraph.metrics.map(m => metricInputs(m, dGraph))
  return _.flatten(asLists)
}

function hasNoOutputs(metricId, dependencyMap) {
  return _.some(dependencyMap, (d) => (d.output === metricId))
}

function allNodes(dependencyMap) {
  return _.uniq(_.flatten(dependencyMap.map(d => [d.input, d.output])))
}

function endNodes(dependencyMap) {
  console.log('allnodes', allNodes(dependencyMap))
  return allNodes(dependencyMap).filter(m => hasNoOutputs(m, dependencyMap))
}

function removeEndNodes(dependencyMap) {
  let _endNodes = endNodes(dependencyMap)
  let newDependencyMap = dependencyMap.filter(d => !_.includes(_endNodes, d.output))
  let lastNode = null

  if (newDependencyMap.length === 0) {
    lastNode = dependencyMap[0].input
  }
  return {endNodes: _endNodes, dependencyMap: newDependencyMap, lastNode: lastNode}
}
