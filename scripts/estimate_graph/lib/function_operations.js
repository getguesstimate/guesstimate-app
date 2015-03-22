'use strict';

var functionOperations = {

  'multiplication': {
    name: 'multiplication',
    sign: 'x',
    apply(inputs){
      var product = _.reduce(inputs, function(product, n) { return product * n; })
      return product;
    }
  },

  'addition': {
    name: 'addition',
    sign: '+',
    apply(inputs){
      var sum = _.reduce(inputs, function(sum, n) { return sum + n; });
      return sum;
    }
  }
}

module.exports = functionOperations;
