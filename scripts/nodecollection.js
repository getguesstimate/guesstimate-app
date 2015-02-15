'use strict';

var Backbone = require("backbone");
require(['lodash'], function(_) {});

var multiply = {
  name: 'multiplication',
  sign: '*',
  apply(inputs){
    var product = _.reduce(inputs, function(product, n) { return product * n; })
    return product;
  }
}

var add = {
  name: 'addition',
  sign: '+',
  apply(inputs){
    var sum = _.reduce(inputs, function(sum, n) { return sum + n; });
    return sum;
  }
}

var efunctions = {
  'mult': multiply,
  'add': add
}

function MakeFunction(node){
  var ftype = node.get('eprops').ftype
  node.efunction = efunctions[ftype]
  node.dependent = function(){ return node.outputs()[0] }
  node.run = function(){
    result = node._run_math()
    node.dependent().updateValue(result)
  }
  node._run_math = function(){
    inputValues = node.inputValues()
    return node.efunction.apply(inputValues)
  }
  node.toCytoscapeName = function(){
    return node.efunction.sign
  }
}

function MakeEstimate(node){
  node.ttype = function(){
    return 'estimate'
  }
  node.toCytoscapeName = function(){
    return node.attributes.eprops.name
  }
}
function MakeDependent(node){
  node.cost = function(){
    return 'dep'
  },
  node.value = null
  node.propogate = function(){
    node.outputs().forEach( e => console.log(e.id) )
  }
  node.updateValue = function(n){ node.value = n; node.propogate() }
  node.toCytoscapeName = function(){
    return node.attributes.eprops.name
  }
}

class Enode extends Backbone.Model{
  defaults(){
    return {
      foo: 'sillybar'
    }
  }
  initialize(attributes){
    this.id = attributes.pid;
    this.inputEdges = [];
    this.outputEdges = [];

    if (this.get('etype') === 'function'){ MakeFunction(this) }
    if (this.get('etype') === 'estimate'){ MakeEstimate(this) }
    if (this.get('etype') === 'dependent'){ MakeDependent(this) }
  }
  inputValues(){
    return _.map(this.inputs(), function(i){ return i.get('eprops').value})
  }
  outputs(){
    return _.map(this.outputEdges, function(e) {return e.outputNode})
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
    var etype = this.get('etype')
    var outputs = _.map(this.outputs(), function(e){return e.toString(indent + 1)})
    var out_s = ""
    if (outputs.length > 0){
      var out_s = ' outputs => \n' + outputs.joint('\n')
    }
    sstring = (Array(indent*3).join('.')) + "([" + pid + etype + "]" + out_s + ")"
    return sstring
  }
  toCytoscape() {
    var e = {}
    e.nodeId = this.id
    e.id = "n" + this.id // Nodes need letters for cytoscape
    e.etype = this.attributes.etype
    _.merge(e, this.attributes.eprops)
    _.merge(e, this.attributes.eprops)
    e.name = this.toCytoscapeName()
    return {data: e};
  }
}

var NodeCollection = Backbone.Collection.extend({
    model: Enode,
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
