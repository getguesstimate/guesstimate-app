'use strict';

//var Enode = require('./enode');
var Backbone = require("backbone");

class Edge extends Backbone.Model{
  defaults(){
  }
  initialize(attributes){
    this.inputNode = this.collection.graph.nodes.get(attributes[0]);
    this.outputNode =  this.collection.graph.nodes.get(attributes[1]);
    //this.outputNode.addInputEdge(this)
    //this.inputNode.addOutputEdge(this)
  };
  inputId(){
    return this.attributes[0]
  };
  outputId(){
    return this.attributes[1]
  };
  toCytoscape(){
    var edge = {}
    edge['id'] = this.inputId() + '-' + this.outputId()
    edge['target'] =  'n' + this.outputId()
    edge['source'] = 'n' + this.inputId()
    return {data: edge}
  };
}

var EdgeCollection = Backbone.Collection.extend({
    model: Edge,
    url: '/foo/bar',
    initialize(collection, graph){
      this.graph = graph
    },
    toCytoscape(){
      var edges = _.map(this.models, function(d){
        return d.toCytoscape();
      });
      return edges;
    }
});

module.exports = EdgeCollection;

