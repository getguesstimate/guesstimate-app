'use strict';

var _ = require('../../lodash.min'),
  $ = require('jquery'),
  React = require('react'),
  Reflux = require('reflux'),

  FermActions = require('../actions'),
  FermGraphStore = require('../stores/fermgraphstore'),
  FermEditingStore = require('../stores/fermeditingstore'),

  GraphPane = require('./graph_pane'),
  EditorPane = require('./editor_pane'),
  SidePane = require('./side_pane')

var App = React.createClass({

  mixins: [
    Reflux.connect(FermGraphStore, "graph"),
    Reflux.connect(FermEditingStore, "editingNode")
  ],

  getEditingNode: function() {
    var id = this.state.editingNode
    var node = this.state.graph.nodes.get(id)
    return node
  },

  addNode: function(type) {
    FermActions.addNode(type)
  },

  updateEditingNode: function(nodeId) {
    FermActions.updateEditingNode(nodeId)
  },

  render: function() {
    return (
      <div className="row .app">
        <div className="col-sm-9 col-md-10">
          <GraphPane graph={this.state.graph} editingNode={this.getEditingNode()} updateEditingNode={this.updateEditingNode}/>
          <EditorPane graph={this.state.graph} addNode={this.addNode} node={this.getEditingNode()}/>
        </div>
        <div className="col-sm-3 col-md-2">
          <SidePane graph={this.state.graph} node={this.getEditingNode()}/>
        </div>
      </div>
    );
  }
});

module.exports = App;
