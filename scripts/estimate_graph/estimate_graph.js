var _ = require('../lodash.min');
var NodeCollection = require('./collections/nodecollection');
var EdgeCollection = require('./collections/edgecollection');

class EstimateGraph {
  constructor(initialData){
    var data = initialData || defaultData
    this.nodes = new NodeCollection(data.nodes, this);
    this.edges = new EdgeCollection(data.edges, this);
    this.propogate();
  }
  removeNode(nodeId){
    var node = this.nodes.get(nodeId)
    var edges = node.edges();
    edges.map(e => e.destroy())
    node.destroy()
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
    {pid: 11, nodeType: 'estimate', name: 'people in NYC', value: 10000000},
    {pid: 2, nodeType: 'estimate', name: 'families per person', value: 0.3},
    {pid: 3, nodeType: 'estimate', name: 'pianos per family', value: 0.1},
    {pid: 4, nodeType: 'estimate', name: 'piano tuners per family', value: 0.001},
    {pid: 5, nodeType: 'dependent', name: 'families in NYC'},
    {pid: 6, nodeType: 'dependent', name: 'pianos in NYC'},
    {pid: 7, nodeType: 'dependent', name: 'piano tuners in NYC'},
    {pid: 8, nodeType: 'function', functionType: 'multiplication'},
    {pid: 9, nodeType: 'function', functionType: 'multiplication'},
    {pid: 10, nodeType: 'function', functionType: 'multiplication'},
  ],
  edges: [
    [11,8],
    [2,8],
    [8,5],
    [5,9],
    [3,9],
    [9,6],
    [6,10],
    [4,10],
    [10,7],
  ]
};

module.exports = EstimateGraph;
