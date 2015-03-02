var React = require('react');
var Reflux = require('reflux');
var FermActions = require('../actions');
var _ = require('../../lodash.min');

var NodeCollection = require('../../nodecollection');
var EdgeCollection = require('../../edgecollection');

class Egraph {
  constructor(args){
    this.nodes = new NodeCollection(args.nodes, this);
    this.edges = new EdgeCollection(args.edges, this);
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

var todoCounter = 1,
    localStorageKey = "fermi";

var fermGraphStore = Reflux.createStore({
    listenables: [FermActions],
    getNodes: function() {
        return this.list;
    },
    addEstimate: function() {
      var newNodeInfo = {
          pid: todoCounter++,
          nodeType: 'estimate'
      };
      var newNode = this.graph.nodes.create(newNodeInfo)
      FermActions.updateEditingNode(newNode.id)
    },
    addFunction: function() {
      var newDependentInfo = {
        pid: todoCounter++,
        nodeType: 'dependent',
        name: '',
        value: ''
      };
      var newFunctionInfo = {
        pid: todoCounter++,
        nodeType: 'function',
        outputIds: newDependentInfo.pid
      };
      //this.updateNodes([newResult, newFun].concat(this.list));
      //var newDependent = this.graph.nodes.create(newDependentInfo)
      var newDependent = this.graph.nodes.create(newDependentInfo)
      var newFunction = this.graph.nodes.create(newFunctionInfo)
      var newEdge = this.graph.edges.create({0:newFunction.id, 1: newDependent.id})
      //if (this.get('outputIds')){
      //var inp = this.id
      //var out = this.get('outputIds')
      //var foo = this.collection.graph.edges.add({0:inp, 1:out})
      FermActions.updateEditingNode(newFunction)
    },
    onAddNode: function(type) {
      if (type=="estimate"){
          this.addEstimate();
      } else {
          this.addFunction();
      }
    },
    onUpdateNodes: function(list){
      _.map(list, function(n){this._onUpdateNode(n.id, n)}, this)
      this.updateGraph();
    },
    onUpdateNode: function(nodeId, newValues) {
      this._onUpdateNode(nodeId, newValues)
      this.updateGraph();
    },
    updateGraph: function(graph) {
      //localStorage.setNode(localStorageKey, JSON.stringify(list));
      this.trigger(this.graph);
    },
    _onUpdateNode: function(nodeId, newValues){
      var node = this.getNode(parseInt(nodeId));
      if (!node) {
          return;
      };
      node.set(newValues)
      node.propogate()
    },
    onRemoveNode: function(nodeId) {
      var node = this.graph.nodes.get(nodeId)
      var edges = node.edges();
      edges.map(e => e.destroy())
      node.destroy()
      this.updateGraph()
      FermActions.resetEditingNode()
    },
    getNode: function(nodeId){
      return this.graph.nodes.get(nodeId)
    },
    getInitialState: function() {

      var data = {
        nodes: [
          {pid: 1, nodeType: 'estimate', name: 'people in NYC', value: 10000000},
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
          [1,8],
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
      this.graph = new Egraph(data);
      var dependents = this.graph.nodes.allOfTtype('dependent')
      dependents.map(n => n.propogate())
      var todoCounter = parseInt(_.max(this.graph.nodes.models, 'id').id) + 1

      // var loadedNodes = localStorage.getNode(localStorageKey);
      // if (!loadedNodes) {
      //     // If no list is in localstorage, start out with a default one
      //     this.list = [
      //         {
      //             id: todoCounter++,
      //             created: new Date(),
      //             name: 'first node',
      //             mean: 0,
      //             type: 'estimate'
      //         },
      //         {
      //             id: todoCounter++,
      //             created: new Date(),
      //             name: 'second node',
      //             mean: 0,
      //             type: 'estimate'
      //         }
      //     ];
      // } else {
      //     this.list = JSON.parse(loadedNodes);
      // }
      // return this.list;
          return this.graph;
    }
})

module.exports = fermGraphStore;
