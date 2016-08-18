import {denormalizeFn, create} from '../metric'
import {expect} from 'chai'

describe('metric', () => {
  let metric = null
  let graph = null
  let result = null

  let guesstimates = [
    {metric: 'abc', name: 'what'},
    {metric: '324', name: 'silly'}
  ]

  let simulations = [
    {metric: '324', data: [2,3,54]},
    {metric: 'abc', data: [2,3,4]}
  ]

  describe('denormalizeFn', () => {
    it('works with guesstimates and simulations', () => {
      metric = {id: 'abc'}
      graph = {metrics: [metric], guesstimates, simulations}
      result = denormalizeFn(graph)(metric)
      expect(result.guesstimate).to.deep.equal(guesstimates[0])
      expect(result.simulation).to.deep.equal(simulations[1])
    })

    it('works with only guesstimates', () => {
      metric = {id: 'abc'}
      graph = {metrics: [metric], guesstimates}
      result = denormalizeFn(graph)(metric)
      expect(result.guesstimate).to.deep.equal(guesstimates[0])
    })
  })

  describe('create', () => {
    it('generates uuid and readableId', () => {
      metric = create([])
      expect(metric.id.length).to.equal(36)
      expect(metric.readableId.length).to.equal(2)
    })
  })
})
