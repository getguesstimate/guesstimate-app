import AmpersandState from 'ampersand-state'

export default AmpersandState.extend({
  props: {
    metric: 'string',
    input: ['string', true],
    distribution: {
      mean: ['number', true, 0],
      stdev: 'number',
      samples: 'array'
    }
  },
  toStore: function() {
    return this.getAttributes({props: true});
  }
});
