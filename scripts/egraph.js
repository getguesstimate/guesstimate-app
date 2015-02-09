'use strict';

var NodeCollection = require('./nodecollection');
var Eedges = require('./eedges');

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
    this.nodes = new NodeCollection(args.nodes);
    this.edges = new Eedges(args.edges);
    this.list = args.nodes;
  }
}


module.exports = Egraph;
