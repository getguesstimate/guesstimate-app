import {expect} from 'chai'

import {toDAG} from '../graph'
import {STYPES} from '../propagation'
//
// Simulation Node:
// {
//   id: String,
//   type: oneof(STYPES),
//   expression: null if type === STYPE.data, else user expression.
//   samples: [...],
//   errors: [...],
// }
//
// Global:
// {
//   id: String,
//   samples: [...],
// }

describe('toDAG', () => {

  const nodes = [
    {
      id: 'metric:1',
      type: STYPES.DATA,
      expression: null,
      samples: [1],
      errors: [],
    },{
      id: 'metric:2',
      type: STYPES.FUNCTION,
      expression: '=${metric:1} * 100 + ${metric:3}',
      samples: [],
      errors: [],
    },{
      id: 'metric:3',
      type: STYPES.FUNCTION,
      expression: '=${metric:1} + 5',
      samples: [],
      errors: [],
    }
  ]

  it('Yields nodes ordered by height', () => {
    const {DAG, errorNodes} = toDAG(nodes)

    expect(_.isEmpty(errorNodes)).to.equal(true)

    expect(DAG.length).to.equal(3)
    expect(DAG.map(n => n.id)).to.deep.equal(['metric:1', 'metric:3', 'metric:2'])
  })
}).only()
