'use strict';

import React from 'react'
import Reflux from 'reflux'
import FermActions from '../actions'
import _ from 'lodash'
import EstimateGraph from '../../estimate_graph/estimate_graph.js'

let nodeCounter = 1

const fermGraphStore = Reflux.createStore({
    listenables: [FermActions],
    getNodes () {
        return this.list;
    },
    addEstimate () {
      const newNodeInfo = {
          pid: nodeCounter++,
          nodeType: 'estimate'
      };
      const newNode = this.graph.nodes.create(newNodeInfo)
      FermActions.updateEditingNode(newNode.id)
    },
    addFunction () {
      const newDependentInfo = {
        pid: nodeCounter++,
        nodeType: 'dependent',
        name: '',
        value: ''
      };
      const newFunctionInfo = {
        pid: nodeCounter++,
        nodeType: 'function',
        outputIds: newDependentInfo.pid
      };
      const newDependent = this.graph.nodes.create(newDependentInfo)
      const newFunction = this.graph.nodes.create(newFunctionInfo)
      const newEdge = this.graph.edges.create({0:newFunction.id, 1: newDependent.id})
      FermActions.updateEditingNode(newFunction)
    },
    onAddNode (type) {
      if (type=="estimate"){
          this.addEstimate();
      } else {
          this.addFunction();
      }
    },
    onUpdateNodes (list) {
      _.map(list, function(n){this._onUpdateNode(n.id, n)}, this)
      this.updateGraph();
    },
    onUpdateNode (nodeId, newValues) {
      this._onUpdateNode(nodeId, newValues)
      this.updateGraph();
    },
    updateGraph (graph) {
      this.trigger(this.graph);
    },
    _onUpdateNode (nodeId, newValues) {
      let node = this.getNode(parseInt(nodeId));
      if (!node) {
          return;
      };
      node.set(newValues)
      node.propogate()
    },
    onRemoveNode (nodeId) {
      this.graph.removeNode(nodeId)
      this.updateGraph()
      FermActions.resetEditingNode()
    },
    getNode (nodeId) {
      return this.graph.nodes.get(nodeId)
    },
    getInitialState () {
      this.graph = new EstimateGraph(false);
      nodeCounter = parseInt(_.max(this.graph.nodes.models, 'id').id) + 1
      return this.graph;
    },
    onGraphSave () {
      app.firebase.child('repos').set({'people-in-nyc': {name: 'people-in-nyc', data: {nodes: this.graph.nodes.toJSON(), edges: this.graph.edges.toJSON()}}})
    },
    onGraphReset (data) {
      this.graph = new EstimateGraph(data);
      window.graph = this.graph
      nodeCounter = parseInt(_.max(this.graph.nodes.models, 'id').id) + 1
      this.updateGraph()
    }
})

module.exports = fermGraphStore;
