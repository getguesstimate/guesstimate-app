import {getVariableNameFromName, shouldTransformName} from './nameToVariableName'

// withReadableId takes an object that needs at least a `name` parameter, and a list of existing metric readable IDs,
// and returns a copy of that object with a `readableId` field set to a unique readableId derived from the name
// parameter, if appropriate, otherwise returns a copy of the obect unchanged.

export function withReadableId(metric, existingReadableIds) {
  const {name} = metric
  const shouldUpdateReadableId = shouldTransformName(name)
  if (!shouldUpdateReadableId) { return metric }

  return {...metric, readableId: getVariableNameFromName(name, existingReadableIds, 3, 3, 3, false, true).toUpperCase()}
}
