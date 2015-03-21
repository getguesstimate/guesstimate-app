'use strict';

var Backbone = require("backbone");
var numeral = require("numeral");
require(['lodash'], function(_) {});

class Group {
  constructor(node, graph){
    this.node = node
    this.graph = graph
  }
  edges(){
    return _.filter(this._allEdges().models, function(n){ return n.get(this.goTo) == this.node.id }, this)
  }
  getEdge(nodeId){
    return _.find(this.edges(), function(n){ return n.get(this.getFrom) == nodeId }, this)
  }
  getEdges(nodeIds){
    return _.map(nodeIds, function(nodeId){ return this.getEdge(nodeId) }, this)
  }
  nodeIds(){
    return _.map(this.nodes(), function(i){return i.id})
  }
  createEdge(nodeId){
    var newObject = {}
    newObject[this.goTo] = this.node.id
    newObject[this.getFrom] = nodeId
    return this._allEdges().create(newObject)
  }
  _allEdges(){ return this.graph.edges }
}

class Outputs extends Group{
  constructor(node, edges){
    this.getFrom = 1
    this.goTo = 0
    super(node,edges)
  }
  nodes(){
    return _.map(this.edges(), function(e){ return e.outputNode})
  }
}

class Inputs extends Group{
  constructor(node, edges){
    this.getFrom = 0
    this.goTo = 1
    super(node,edges)
  }
  nodes(){
    return _.map(this.edges(), function(e){ return e.inputNode})
  }
}

class AbstractNode extends Backbone.Model{
  defaults(){
    return {
      foo: 'sillybar'
    }
  }
  setup(){
  }
  initialize(attributes){
    this.id = attributes.pid;
    this.outputs = new Outputs(this, this.collection.graph)
    this.inputs = new Inputs(this, this.collection.graph)
    this.setup()
  }
  inputEdges(){
  }
  outputEdges(){
  }
  edges(){
    return _.union(this.inputs.edges(), this.outputs.edges())
  }
  inputValues(){
    return _.map(this.inputs.nodes(), function(i){ return i.get('value')})
  }
  //outputs(){
    //return _.map(this.outputEdges(), function(e) {return e.outputNode})
  //}
  allOutputs(){
    var outputs = this.outputs.nodes()
    var furtherOutputs = _.map(outputs, function(e){return e.allOutputs()})
    return _.flatten([outputs, furtherOutputs])
    return outputs
  }
  //inputs(){
    //return _.map(this.inputEdges(), function(e) {return e.inputNode})
  //}
  toString(indent){
    //indent = indent || 0
    //var pid = this.get('pid')
    //var nodeType = this.get('nodeType')
    //var outputs = _.map(this.outputs(), function(e){return e.toString(indent + 1)})
    //var out_s = ""
    //if (outputs.length > 0){ //var out_s = ' outputs => \n' + outputs.joint('\n')
    //}
    //sstring = (Array(indent*3).join('.')) + "([" + pid + nodeType + "]" + out_s + ")"
    //return 'test'
  }
  toCytoscape() {
    var e = {}
    e.nodeId = this.id
    e.nodeType = this.attributes.nodeType
    _.merge(e, this.attributes)
    e.id = "n" + this.id // Nodes need letters for cytoscape
    e.name = this.toCytoscapeName()
    if (!e.name){ e.name = 'Add Name' }
    return {data: e};
  }

  formatValue(){
    var value = parseFloat(this.get('value'))
    if (value > 10){
      return numeral(value).format('0.0a')
    }
    else {
      return value.toPrecision(2)
    }
  }
  toCytoscapeName(){
    var name = this.get('name')
    var value = this.formatValue()
    var totalName = undefined
    if (value && name){
      totalName = value + ' - ' + name
    }
    else if (value || name){
      totalName = value || name
    }
    return totalName
  }
}

module.exports = AbstractNode;
