'use strict';

import React from 'react'
import Reflux from 'reflux'

import FermActions from './actions'
import FermGraphStore from './stores/fermgraphstore'
import FermEditingStore from './stores/fermeditingstore'

import GraphPane from './subcomponents/graph_pane.jsx'
import EditorPane from './subcomponents/editor_pane.jsx'
import SidePane from './subcomponents/side_pane.jsx'

const GraphEditorBase = React.createClass({

  mixins: [
    Reflux.connect(FermGraphStore, "graph"),
    Reflux.connect(FermEditingStore, "editingNode")
  ],

  getEditingNode () {
    let id = this.state.editingNode
    let node = this.state.graph.nodes.get(id)
    return node
  },

  addNode (type) {
    FermActions.addNode(type)
  },

  updateEditingNode (nodeId) {
    FermActions.updateEditingNode(nodeId)
  },

  saveGraph () {
    FermActions.graphSave()
  },

  componentWillMount () {
    FermActions.graphReset(this.props.repo)
  },

  render () {
    return (
      <div className="row .app">
        <div className="col-sm-9 col-md-10">
          <GraphPane graph={this.state.graph} editingNode={this.getEditingNode()} updateEditingNode={this.updateEditingNode}/>
          <EditorPane graph={this.state.graph} addNode={this.addNode} saveGraph={this.saveGraph} node={this.getEditingNode()}/>
        </div>
        <div className="col-sm-3 col-md-2">
          <SidePane graph={this.state.graph} node={this.getEditingNode()}/>
        </div>
      </div>
    );
  }
});

module.exports = GraphEditorBase;
