import {getVariableNameFromName, shouldTransformName} from './nameToVariableName'

// withVariableName takes a fact that needs at least a `name` parameter, and a list of existing fact names, and returns
// a copy of that object with a `variable_name` field set to a unique variable_name derived from the name parameter, if
// appropriate, otherwise returns a copy of the obect unchanged.

export function withVariableName(fact, existingReadableIds) {
  const {name} = fact
  if (!shouldTransformName(name)) { return fact }

  return {...fact, variable_name: getVariableNameFromName(name, existingReadableIds, 18, 2, 18, true, false).toLowerCase()}
}
