export const INTERMEDIATE = 'INTERMEDIATE'
export const OUTPUT = 'OUTPUT'
export const INPUT = 'INPUT'
export const NOEDGE = 'NOEDGE'

export function swap(array, index1, index2){
  const firstElement = array[index1]
  const secondElement = array[index2]
  let newArray = _.clone(array)
  newArray[index1] = secondElement
  newArray[index2] = firstElement
  return newArray
}

export function incrementItemPosition(array, elementName, positiveDirection){
  const index = _.indexOf(array, elementName)
  let nextIndex
  if (positiveDirection) {
    if (index === array.length - 1) { return array }
    nextIndex = index + 1
    const newArray = swap(array, index, nextIndex)
    return newArray
  }
  if (!positiveDirection) {
    if (index === 0) { return array }
    nextIndex = index - 1
    const newArray = swap(array, index, nextIndex)
    return newArray
  }
}

export function relationshipType(edges){
  if (edges.inputs.length && edges.outputs.length) { return INTERMEDIATE }
  if (edges.inputs.length) { return OUTPUT }
  if (edges.outputs.length) { return INPUT }
  return NOEDGE
}

