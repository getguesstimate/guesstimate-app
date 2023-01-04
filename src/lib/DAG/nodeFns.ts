import _ from "lodash";
import { orFns } from "~/lib/engine/collections";
import {
  typeSafeEq,
  notIn,
  indicesOf,
  mutableCopy,
  orArr,
} from "~/lib/engine/utils";

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
  ({ id }, ancestors) =>
  (n) =>
    ancestors[id].includes(n.id) || ancestors[n.id].includes(id);

export const allInputsWithinFn =
  (nodes, ignoreSet: any[] = []) =>
  (n) =>
    _.every(n.inputs.filter(notIn(ignoreSet)), idMatchesSomeFn(nodes));
export const anyRelationsWithinFn = (nodes, ancestors) =>
  orFns(...nodes.map((n) => isRelatedToFn(n, ancestors)));
export const inACycleWithNodeFn =
  ({ id }, ancestors) =>
  (n) =>
    ancestors[id].includes(n.id) && ancestors[n.id].includes(id);

export const containsDuplicates = (nodes) =>
  _.some(nodes, (n, i) => idMatchesSomeFn(nodes.slice(i + 1))(n.id));
export const getMissingInputs = (nodes): any[] =>
  _.uniq(_.flatten(nodes.map((n) => n.inputs))).filter(
    _.negate(idMatchesSomeFn(nodes))
  );
export const isDescendedFromFn = (ids: string[], ancestors) => (n) =>
  _.some(ids, (id) => ancestors[n.id].includes(id));
export const withInputIndicesFn = (nodes: any[]) => (n) => ({
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
export function getNodeAncestors(nodes: any[]): any {
  let unprocessedNodes = mutableCopy(nodes);

  let newAncestors: any = _.transform(
    nodes,
    (res, { id, inputs }) => {
      res[id] = inputs;
    },
    {}
  );
  let nodeAncestors = _.transform(
    nodes,
    (res, { id }) => {
      res[id] = [];
    },
    {}
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
