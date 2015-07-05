'use strict';

import React from 'react'
import Reflux from 'reflux'
import FermActions from '../actions'
import _ from 'lodash'
import EstimateGraph from '../../estimate_graph/estimate_graph.js'

var nodeCounter = 1,
    localStorageKey = "fermi";

var fermGraphStore = Reflux.createStore({
    listenables: [FermActions],
    getNodes: function() {
        return this.list;
    },
    addEstimate: function() {
      var newNodeInfo = {
          pid: nodeCounter++,
          nodeType: 'estimate'
      };
      var newNode = this.graph.nodes.create(newNodeInfo)
      FermActions.updateEditingNode(newNode.id)
    },
    addFunction: function() {
      var newDependentInfo = {
        pid: nodeCounter++,
        nodeType: 'dependent',
        name: '',
        value: ''
      };
      var newFunctionInfo = {
        pid: nodeCounter++,
        nodeType: 'function',
        outputIds: newDependentInfo.pid
      };
      var newDependent = this.graph.nodes.create(newDependentInfo)
      var newFunction = this.graph.nodes.create(newFunctionInfo)
      var newEdge = this.graph.edges.create({0:newFunction.id, 1: newDependent.id})
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
      this.graph.removeNode(nodeId)
      this.updateGraph()
      FermActions.resetEditingNode()
    },
    getNode: function(nodeId){
      return this.graph.nodes.get(nodeId)
    },
    getInitialState: function() {
      this.graph = new EstimateGraph(false);
      nodeCounter = parseInt(_.max(this.graph.nodes.models, 'id').id) + 1
      return this.graph;
    },
    onGraphReset: function(data) {
      this.graph = new EstimateGraph(data);
      nodeCounter = parseInt(_.max(this.graph.nodes.models, 'id').id) + 1
      this.updateGraph()
    }
})

module.exports = fermGraphStore;
