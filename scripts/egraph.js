'use strict';

var Enodes = require('./enodes');
var Eedges = require('./eedges');
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
  constructor(args){
    this.enodes = Enodes.import(args.nodes);
    this.edges = new Eedges(args.edges);
    this.list = args.nodes;
  }
}


module.exports = Egraph;
