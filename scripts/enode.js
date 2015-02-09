'use strict';
var Backbone = require("backbone");

class Enode extends Backbone.Model{
  initialize(attributes){
    this.id = attributes['pid'];
    this.foo = 'bar2'
    this.set('properties1', "bash");
  };
  test() {
    return 5;
  }
}

module.exports = Enode;
