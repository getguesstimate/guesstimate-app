var _ = require('lodash');
var NodeCollection = require('./collections/nodecollection');
var EdgeCollection = require('./collections/edgecollection');

class EstimateGraph {
  constructor(initialData){
    var data = initialData || defaultData
    this.nodes = new NodeCollection(data.nodes, this);
    this.edges = new EdgeCollection(data.edges, this);
    this.unsavedChanges = false
    this.propogate();
  }
  removeNode(nodeId){
    var node = this.nodes.get(nodeId)
    node.remove()
  }
  propogate(){
    var dependents = this.nodes.allOfTtype('dependent');
    dependents.map(n => n.propogate())
  }
  outsideMetrics(node){
    var nodes = this.outsideNodes(node)
    return _.select(nodes, function(n) {return (n.ttype() !== 'function')})
  }
  // Used to find possible outputs for a function node
  outsideNodes(node){
    var insideNodes = _.union([node], node.allOutputs())
    return _.difference(this.nodes.models, insideNodes)
  }
}

var defaultData = {
  nodes: [
  ],
  edges: [
  ]
};

module.exports = EstimateGraph;
