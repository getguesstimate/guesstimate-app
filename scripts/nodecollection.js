'use strict';

var Backbone = require("backbone");
require(['lodash'], function(_) {});

var multiply = {
  name: 'multiplication',
  sign: '*',
  apply(inputs){
    product = _.reduce(inputs, function(product, n) { return product * n; })
    return product
  }
}

var add = {
  name: 'addition',
  sign: '+',
  apply(inputs){
    sum = _.reduce(inputs, function(sum, n) { return sum + n; })
    return sum
  }
}

var efunctions = {
  'mult': multiply,
  'add': add
}

function MakeFunction(node){
  ftype = node.get('eprops').ftype
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
}

function MakeEstimate(node){
  node.ttype = function(){
    return 'estimat'
  }
}
function MakeDependent(node){
  node.cost = function(){
    return 'dep'
  },
  node.value = null
  node.propogate = function(){
    console.log('working!')
    //for (let e of node.outputs()){ console.log('hi') }
    debugger;
    node.outputs().forEach(function(e){console.log(e.id)})
  }
  node.updateValue = function(n){ node.value = n; node.propogate() }
}

class Enode extends Backbone.Model{
  defaults(){
    return {
      foo: 'sillybar',
      completed: 'false'
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
  test() {
    return 5;
  }
}

var NodeCollection = Backbone.Collection.extend({
    model: Enode,
    initialize(collection, graph){
      this.graph = graph
    }
});

module.exports = NodeCollection;
