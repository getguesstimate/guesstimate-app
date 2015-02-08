'use strict';

var Enodes = require('./enodes');
var Enode = require('./enode');

class Counter {
  constructor(){
    this.count = 0
  }
  increment(){
    this.count += 1;
    return this.count
  }
}

class Egraph {
  constructor(){
    this.enodes = Enodes;
  }
}


module.exports = Egraph;
