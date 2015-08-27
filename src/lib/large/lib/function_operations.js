var _ = require('lodash');

module.exports = {
  multiplication: {
    name: 'multiplication',
    sign: 'x',
    apply(inputs) {
      var product = _.reduce(inputs, (p, n) => p * n);
      return product;
    }
  },

  addition: {
    name: 'addition',
    sign: '+',
    apply(inputs){
      var sum = _.reduce(inputs, (s, n) => s + n);
      return sum;
    }
  }
};
