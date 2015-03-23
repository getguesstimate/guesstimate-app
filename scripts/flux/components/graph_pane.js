'use strict';

var _ = require('../../lodash.min');
var $ = require('jquery');
var React = require('react');
var Reflux = require('reflux');
var FermActions = require('../actions');
var CytoscapeGraph = require('./cytoscape_graph');

var GraphPane = React.createClass( {

  render: function() {
    return (
      <CytoscapeGraph graph={this.props.graph} updateEditingNode={this.props.updateEditingNode} editingNode={this.props.editingNode}/>
    )
  }
});

module.exports = GraphPane;
