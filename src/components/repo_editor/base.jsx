'use strict';

import React from 'react'
import Reflux from 'reflux'

import FermActions from './actions'
import FermGraphStore from './stores/fermgraphstore'
import FermEditingStore from './stores/fermeditingstore'

import GraphPane from './subcomponents/graph_pane.jsx'
import HoverPane from './subcomponents/hover_pane.jsx'
import Header from './subcomponents/header.jsx'
import NodeForm from './subcomponents/node_form.jsx'

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
    let mainPaneClasses = this.props.savable ? "col-sm-9 col-md-10 main-pane" : "col-xs-12 main-pane"
    let sidePaneClasses = this.props.savable ? "col-sm-3 col-md-2 side-pane" : "hidden side-pane"
    let header = this.props.savable ? <Header addNode={this.addNode} saveGraph={this.saveGraph} unsavedChanges={this.state.graph.unsavedChanges} savable={this.props.savable}/> : null
    return (
      <div className="row repo-component">
        <div className={mainPaneClasses}>
          {header}
          <GraphPane graph={this.state.graph} editingNode={this.getEditingNode()} updateEditingNode={this.updateEditingNode}/>
          <HoverPane graph={this.state.graph} node={this.getEditingNode()}/>
        </div>
        <div className={sidePaneClasses}>
          <NodeForm graph={this.state.graph} node={this.getEditingNode()} formSize="large" />
        </div>
      </div>
    );
  }
});

module.exports = GraphEditorBase;
