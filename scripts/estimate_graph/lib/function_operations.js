'use strict';
var _ = require('../../lodash.min');

var functionOperations = {

  'multiplication': {
    name: 'multiplication',
    sign: 'x',
    apply(inputs){
      //var product = _.reduce(inputs, function(product, n) { return product * n; })
      var product = 0;
      return product;
    }
  },

  'addition': {
    name: 'addition',
    sign: '+',
    apply(inputs){
      //var sum = _.reduce(inputs, function(sum, n) { return sum + n; });
      var sum = 0;
      return sum;
    }
  }
}

module.exports = functionOperations;
