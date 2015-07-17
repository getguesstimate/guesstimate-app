'use strict';

var Backbone = require("backbone");

class Edge extends Backbone.Model {

  defaults() {
  }

  initialize(attributes) {
    this.inputNode = this.collection.graph.nodes.get(attributes[0]);
    this.outputNode =  this.collection.graph.nodes.get(attributes[1]);
  };

  inputId() {
    return this.attributes[0]
  };

  outputId() {
    return this.attributes[1]
  };

  toCytoscape() {
    var edge = {}
    edge['id'] = this.inputId() + '-' + this.outputId()
    edge['target'] =  'n' + this.outputId()
    edge['source'] = 'n' + this.inputId()
    edge['toType'] = this.outputNode.get('nodeType')
    return {data: edge}
  };
}

module.exports = Edge;
