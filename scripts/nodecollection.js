'use strict';

var Backbone = require("backbone");
require(['lodash'], function(_) {});

var multiplication = {
  name: 'multiplication',
  sign: '*',
  apply(inputs){
    var product = _.reduce(inputs, function(product, n) { return product * n; })
    return product;
  }
}

var addition = {
  name: 'addition',
  sign: '+',
  apply(inputs){
    var sum = _.reduce(inputs, function(sum, n) { return sum + n; });
    return sum;
  }
}

var efunctions = {
  'multiplication': multiplication,
  'addition': addition
}
class Enode extends Backbone.Model{
  defaults(){
    return {
      foo: 'sillybar'
    }
  }
  setup(){
  }
  initialize(attributes){
    this.id = attributes.pid;
    this.inputEdges = [];
    this.outputEdges = [];

    //if (this.get('nodeType') === 'function'){ MakeFunction(this) }
    //if (this.get('nodeType') === 'estimate'){ MakeEstimate(this) }
    //if (this.get('nodeType') === 'dependent'){ MakeDependent(this) }
    this.setup()
  }
  inputValues(){
    return _.map(this.inputs(), function(i){ return i.value})
  }
  outputs(){
    return _.map(this.outputEdges, function(e) {return e.outputNode})
  }
  allOutputs(){
    var outputs = this.outputs()
    furtherOutputs = _.map(outputs, function(e){return e.allOutputs()})
    return _.flatten([outputs, furtherOutputs])
  }
  inputs(){
    return _.map(this.inputEdges, function(e) {return e.inputNode})
  }
  addInputEdge(inputEdge){
    this.inputEdges.push(inputEdge)
  }
  addOutputEdge(outputEdge){
    this.outputEdges.push(outputEdge)
  }
  toString(indent){
    indent = indent || 0
    var pid = this.get('pid')
    var nodeType = this.get('nodeType')
    var outputs = _.map(this.outputs(), function(e){return e.toString(indent + 1)})
    var out_s = ""
    if (outputs.length > 0){
      var out_s = ' outputs => \n' + outputs.joint('\n')
    }
    sstring = (Array(indent*3).join('.')) + "([" + pid + nodeType + "]" + out_s + ")"
    return sstring
  }
  toCytoscape() {
    var e = {}
    e.nodeId = this.id
    e.nodeType = this.attributes.nodeType
    _.merge(e, this.attributes)
    e.id = "n" + this.id // Nodes need letters for cytoscape
    e.name = this.toCytoscapeName()
    return {data: e};
  }
}

class EstimateNode extends Enode{
  ttype(){
    return 'estimate'
  }
  toCytoscapeName(){
    return this.attributes.name
  }
}

  //node.value = null
class DependentNode extends Enode{
  cost(){
    return 'dep'
  }
  propogate(){
    this.outputs().forEach( e => console.log(e.id) )
  }
  updateValue(n){
    this.value = n;
    this.propogate()
  }
  toCytoscapeName(){
    this.attributes.name
  }
}


class FunctionNode extends Enode{
  efunction(){
    var functionType = this.get('functionType')
    return efunctions[functionType]
  }
  dependent(){
    return this.outputs()[0]
  }
  run(){
    result = this._run_math()
    this.dependent().updateValue(result)
  }
  run_math(){
    inputValues = this.inputValues()
    return this.efunction().apply(inputValues)
  }
  toCytoscapeName(){
    return this.efunction().sign
  }
  setup(){
    console.log('setting up')
    //functionType: 'addition'
  }
}
var NodeCollection = Backbone.Collection.extend({
    model: function(attrs, options) {
      switch (attrs.nodeType){
        case 'estimate':
          return new EstimateNode(attrs, options)
        case 'dependent':
          return new DependentNode(attrs, options)
        case 'function':
          return new FunctionNode(attrs, options)
        default:
          return new Enode(attrs, options)
      }
    },
    url: '/foo/bar',
    initialize(collection, graph){
      this.graph = graph;
    },
    toCytoscape() {
      var nodes = _.map(this.models, function(d){
        return d.toCytoscape();
      });
      return nodes;
    }
});

module.exports = NodeCollection;
