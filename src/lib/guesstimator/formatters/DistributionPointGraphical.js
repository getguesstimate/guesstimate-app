import {graphicalMixin} from './lib.js'

export const item = Object.assign(
  {}, graphicalMixin,
  {
    guesstimateType: 'POINT',
    inputType: 'GRAPHICAL',
    relevantNumbers: [
      {name: 'value', required: true}
    ]
  }
)
