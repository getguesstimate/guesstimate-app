import * as actions from './actions'

describe('Autofill Actions', () => {
  describe('dynamic fill', () => {
    // function fillDynamic(startMetric, startGuesstimate, direction)
    //   ...
    //   return (location, metrics) => {
    //     ...
    //     return { metric, guesstimate }
    const startInput = '=1 + VL'
    const startMetric = {
      id: '1',
      readableId: 'AA',
      location: {row: 1, column: 1},
    }
    const startGuesstimate = {
      metric: '1',
      input: startInput,
      guesstimateType: 'FUNCTION',
    }
    const direction = {row: 0, column: 1}

    it('fills constants properly', () => {
      const location = {row: 1, column: 2}
      const metrics = [
        {
          name: 'Constant.',
          id: '2',
          readableId: 'VL',
          location: {row: 0, column: 0},
        },
      ]
      const fillFn = actions.fillDynamic(startMetric, startGuesstimate, direction)
      const {guesstimate: {input}} = fillFn(location, metrics)
      expect(input).to.equal(startInput)
    })

    it('fills properly with no translatable metrics, but some non-constant', () => {
      const location = {row: 1, column: 2}
      const metrics = [
        {
          id: '2',
          readableId: 'VL',
          location: {row: 0, column: 0},
        },
      ]
      const fillFn = actions.fillDynamic(startMetric, startGuesstimate, direction)
      const {metric, guesstimate} = fillFn(location, metrics)
      expect(!!metric).to.equal(false)
      expect(!!guesstimate).to.equal(false)
    })
  })
})
