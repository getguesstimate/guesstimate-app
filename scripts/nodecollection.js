'use strict';

//var Enode = require('./enode');
var Backbone = require("backbone");

class Enode extends Backbone.Model{
  defaults(attributes){
    console.log(attributes);
    return {
      foo: 'sillybar',
      completed: 'false'
    }
  }
  initialize(attributes){
    this.id = attributes['pid'];
  };
  test() {
    return 5;
  }
}

var NodeCollection = Backbone.Collection.extend({
    model: Enode
});

module.exports = NodeCollection;
