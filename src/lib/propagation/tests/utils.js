import {expect} from 'chai'

import {NODE_TYPES} from '../constants'

export const toExprId = id => `\$\{${toNodeId(id)}\}`
export const toNodeId = idNum => `node:${idNum}`
export const toExpr = inputNums => `=${inputNums.map(toExprId).join(' + ')}`
export const makeNode = (idNum, inputNums=[], samples=[], errors=[], type=NODE_TYPES.FUNCTION, expression=toExpr(inputNums)) => (
  {id: toNodeId(idNum), errors, samples, type, expression}
)

export const expectNodesToBe = (DAG, validIds, errorIds) => {
  expect(DAG.graphErrorNodes.map(n => n.id)).to.deep.have.members(errorIds.map(toNodeId))
  expect(DAG.nodes.map(n => n.id)).to.deep.equal(validIds.map(toNodeId))
}
