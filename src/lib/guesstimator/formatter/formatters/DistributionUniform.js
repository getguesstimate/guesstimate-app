import {graphicalMixin} from './lib.js'

export const item = Object.assign(
  {}, graphicalMixin,
  {
    guesstimateType: 'UNIFORM',
    inputType: 'GRAPHICAL',
    formatterName: 'DISTRIBUTION_UNIFORM',
    relevantNumbers: [
      {name: 'low', required: true},
      {name: 'high', required: true}
    ]
  }
)
