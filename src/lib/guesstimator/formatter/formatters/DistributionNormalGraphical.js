import {graphicalMixin} from './lib.js'

export const item = Object.assign(
  {}, graphicalMixin,
  {
    guesstimateType: 'NORMAL',
    inputType: 'GRAPHICAL',
    formatterName: 'DISTRIBUTION_NORMAL_GRAPHICAL',
    relevantNumbers: [
      {name: 'low', required: true},
      {name: 'high', required: true},
      {name: 'min', required: false},
      {name: 'max', required: false},
    ]
  }
)
