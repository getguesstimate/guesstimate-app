'use strict';

var _ = require('../../lodash.min');
var $ = require('jquery');
var React = require('react');
var Reflux = require('reflux');
var FermActions = require('../actions');
var fermGraphStore = require('../stores/fermgraphstore');
var fermEditingStore = require('../stores/fermeditingstore');
var fermLocationStore = require('../stores/locationstore');

var GraphPane = require('./graph_pane');
var [EditorPane, SidePane] = require('./editor_pane');

window.fermEditingStore = fermEditingStore;
window.fermLocationStore = fermLocationStore;
window.fermGraphStore = fermGraphStore;

var App = React.createClass({

  mixins: [
    Reflux.connect(fermGraphStore, "graph"),
    Reflux.connect(fermEditingStore, "editingNode")
  ],

  getNodeById: function(nodeId) {
    return this.state.graph.nodes.get(nodeId)
  },

  handleThis: function(e) {
    switch (e.keyCode) {
      case 68: // delete
      case 70:
      default:
    };
  },

  componentDidMount: function() {
    addEventListener("keydown", this.handleThis);
  },

  getEditingNode: function() {
    var id = this.state.editingNode;
    var node = this.getNodeById(id);
    return node;
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
