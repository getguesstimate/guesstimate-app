'use strict';

//var Enode = require('./enode');
var Backbone = require("backbone");

class Edge extends Backbone.Model{
  defaults(){
  }
  initialize(attributes){
    this.inputNode = this.collection.graph.nodes.get(attributes[0]);
    this.outputNode =  this.collection.graph.nodes.get(attributes[1]);
    this.outputNode.addInputEdge(this)
    this.inputNode.addOutputEdge(this)
  };
}

var EdgeCollection = Backbone.Collection.extend({
    model: Edge,
    initialize(collection, graph){
      this.graph = graph
    }
});

module.exports = EdgeCollection;

