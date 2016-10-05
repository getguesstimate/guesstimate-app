import * as constants from './constants'
import * as _utils from 'gEngine/utils'
import * as _collections from 'gEngine/collections'

const ID_REGEX = /\$\{([^\}]*)\}/g

// ERRORS:
const {
  ERROR_TYPES: {GRAPH_ERROR},
  ERROR_SUBTYPES: {GRAPH_ERROR_SUBTYPES: {MISSING_INPUT_ERROR, IN_INFINITE_LOOP, INVALID_ANCESTOR_ERROR, DUPLICATE_ID_ERROR}},
} = constants

const addError = (type, subType, dataFn=()=>({})) => n => ({...n, errors: [...n.errors, {type, subType, ...dataFn(n)}]})
const addGraphError = _.partial(addError, GRAPH_ERROR)

const getInvalidInputsFn = nodes => n => ({missingInputs: _.filter(n.inputs, i => !_collections.some(nodes, i))})
export const withMissingInputError = nodes => addGraphError(MISSING_INPUT_ERROR, getInvalidInputsFn(nodes))
export const hasMissingInputs = nodes => _.negate(allInputsWithin(nodes))

export const withDuplicateIdError = addGraphError(DUPLICATE_ID_ERROR)
export const hasDuplicateId = nodes => ({id}) => _collections.filter(nodes, id).length > 1

export const withInfiniteLoopError = addGraphError(IN_INFINITE_LOOP)

const concatErrorIds = a => (running, curr) => curr.subType === INVALID_ANCESTOR_ERROR ? [...running, ...curr.ancestors] : [...running, a]
const brokenAncestors = node => _utils.orArr(_.get(node, 'errors')).reduce(concatErrorIds(node.id), [])
const inputErrorIdsFn = errorNodes => i => _collections.some(errorNodes, i) ? brokenAncestors(_collections.get(errorNodes, i)) : []
const getInvalidAncestorsFn = errorNodes => n => {
  let ancestors = _.uniq(_.flatten(n.inputs.map(inputErrorIdsFn(errorNodes)))).filter(_utils.isPresent)
  const inputs = _.remove(ancestors, n.inputs.includes.bind(n.inputs))
  return {ancestors, inputs}
}
export const withAncestralError = errorNodes => addGraphError(INVALID_ANCESTOR_ERROR, getInvalidAncestorsFn(errorNodes))

export const hasErrors = n => !_.isEmpty(_.get(n, 'errors'))

// INPUTS:
export const anyInputsWithin = inputNodeSet => n => _.some(n.inputs, i => _collections.some(inputNodeSet, i))
export const allInputsWithin = inputNodeSet => n => _.every(n.inputs, i => _collections.some(inputNodeSet, i))

export const extractInputs = n => ({...n, inputs: _.uniq(_utils.getSubMatches(n.expression, ID_REGEX, 1))})

// RELATIONS
const getChildrenIndices = (n, nodes) => _utils.indicesOf(nodes, n2 => _.some(n2.inputs, id => _utils.typeSafeEq(id, n.id)))
const getParentIndices = (n, nodes) => _utils.indicesOf(nodes, n2 => _.some(n.inputs, id => _utils.typeSafeEq(id, n2.id)))
export const withRelatives = (nodes, ancestorMap) => n => ({
  ...n,
  childrenIndices: getChildrenIndices(n, nodes),
  parentIndices: getParentIndices(n, nodes),
  ancestors: _utils.orArr(_.get(ancestorMap, `${n.id}.ancestors`)),
})
