import _ from "lodash";
import { orFns } from "~/lib/engine/collections";
import { indicesOf, notIn, orArr, typeSafeEq } from "~/lib/engine/utils";
import {
  NodeAncestors,
  SimulationNodeParams,
  SimulationNodeParamsWithInputs,
} from "../propagation/DAG";
import { CyclePseudoNode } from "./DAG";

/*
 * These funtions below operate on objects referred to as `nodes`. A `node` is an object that has (at least) parameters
 * `id` and `inputs`. Ids should be unique strings, and inputs is a list of ids to other nodes that are inputs to the
 * specified node. Nodes may also be 'cycle' pseudo nodes, which are nodes that represent a fully cyclical set of nodes.
 * These nodes have an `isCycle` parameter set to true, and store the nodes contained in that cycle in the property
 * `nodes`.
 */

const matchesIdFn = (testId) => (n) =>
  !!n.isCycle
    ? _.some(n.nodes, ({ id }) => typeSafeEq(testId, id))
    : typeSafeEq(testId, n.id);

const idMatchesSomeFn = (nodes) => (id) => _.some(nodes, matchesIdFn(id));

const isRelatedToFn =
  <T extends { id: string }>({ id }: T, ancestors: NodeAncestors) =>
  (n: T) =>
    ancestors[id].includes(n.id) || ancestors[n.id].includes(id);

export const allInputsWithinFn =
  (nodes, ignoreSet: string[] = []) =>
  (n) =>
    _.every(n.inputs.filter(notIn(ignoreSet)), idMatchesSomeFn(nodes));

export const anyRelationsWithinFn = <T extends { id: string }>(
  nodes: T[],
  ancestors: NodeAncestors
) => orFns(...nodes.map((n) => isRelatedToFn(n, ancestors)));

export const inACycleWithNodeFn =
  ({ id }: { id: string }, ancestors: NodeAncestors) =>
  (n: SimulationNodeParamsWithInputs) =>
    ancestors[id].includes(n.id) && ancestors[n.id].includes(id);

export const containsDuplicates = (nodes: SimulationNodeParams[]) =>
  _.some(nodes, (n, i) => idMatchesSomeFn(nodes.slice(i + 1))(n.id));

export const getMissingInputs = (
  nodes: (SimulationNodeParamsWithInputs | CyclePseudoNode)[]
) =>
  _.uniq(_.flatten(nodes.map((n) => n.inputs))).filter(
    _.negate(idMatchesSomeFn(nodes))
  );

export const isDescendedFromFn =
  (ids: string[], ancestors) => (n: SimulationNodeParamsWithInputs) =>
    _.some(ids, (id) => ancestors[n.id].includes(id));

export const withInputIndicesFn =
  (nodes: SimulationNodeParamsWithInputs[]) =>
  (n: SimulationNodeParamsWithInputs) => ({
    ...n,
    inputIndices: indicesOf(nodes, ({ id }) => n.inputs.includes(id)),
  });

// getNodeAncestors returns a hash of node Ids to all of it's ancestors within the set of passed nodes. See tests for
// examples.
const nextLevelAncestors = (curr, total, key) =>
  _.uniq(
    _.flatten(curr.map((a) => orArr(total[a]))).filter(
      (a) => !total[key].includes(a)
    )
  );

const getNewAncestorsFn = (nodeAncestors) => (res, value, key) => {
  res[key] = nextLevelAncestors(value, nodeAncestors, key);
};

export function getNodeAncestors(
  nodes: SimulationNodeParamsWithInputs[]
): NodeAncestors {
  let newAncestors = _.transform(
    nodes,
    (res, { id, inputs }) => {
      res[id] = inputs;
    },
    {} as NodeAncestors
  );
  let nodeAncestors = _.transform(
    nodes,
    (res, { id }) => {
      res[id] = [];
    },
    {} as NodeAncestors
  );

  while (!_.isEmpty(newAncestors)) {
    _.forEach(newAncestors, (newAncestors, id) => {
      nodeAncestors[id].push(...newAncestors);
    });
    newAncestors = _.omitBy(
      _.transform(newAncestors, getNewAncestorsFn(nodeAncestors), {}),
      _.isEmpty
    );
  }

  return nodeAncestors;
}
