'use strict';

var Enode = require('./enode');
//class Enodes {
  //constructor(properties){
    //this.properties = properties;
  //}
//}

class Counter {
  constructor(){
    this.count = 0
  }
  increment(){
    this.count += 1;
    return this.count
  }
}

enodes = new Map;

enodes.counter = new Counter
enodes.new = function(o){
  n = this.counter.increment();
  this.set(n, o)
}

Enodes = enodes

module.exports = Enodes;
