'use strict';

var _ = require('../../lodash.min');
var $ = require('jquery');
var React = require('react');
var Reflux = require('reflux');
var FermActions = require('../actions');
var cytoscape_graph = require('../../cytoscape/cytoscape_graph');
window.cytoscape_graph = cytoscape_graph;

  var GraphPane = React.createClass( {
    formatNodes() {
      var regular = this.props.graph.nodes.toCytoscape()
      if (this.props.editingNode) {
        var editingCytoscapeNode = _.find(regular, function(f){return f.data.nodeId == this.props.editingNode.id}, this)
        editingCytoscapeNode.data.editing = "true"
      }
      return regular
    },

    formatEdges() {
      return this.props.graph.edges.toCytoscape()
    },

    updateAllPositions() {
      var newLocations = _.map(cytoscape_graph.cy.nodes(), function(n){return {id: n.data().nodeId, renderedPosition: n.renderedPosition()}})
      if (!isNaN(newLocations[0].renderedPosition.x)) {
        FermActions.updateAllNodeLocations(newLocations);
      }
    },

    cytoscapeMounted() {
      this.updateAllPositions()
    },

    componentDidMount() {
      var el = $('.cytoscape_graph')[0];
      var initialElements = {
          nodes: this.formatNodes(),
          edges: this.formatEdges()
        }
      var actions = { updateEditingNode: this.props.updateEditingNode, updatePositions: this.updatePositions, cytoscapeMounted: this.cytoscapeMounted }
      cytoscape_graph.create(el, initialElements, actions);
    },

    componentDidUpdate() {
      cytoscape_graph.update(this.formatNodes(), this.formatEdges(), this.updateAllPositions);
    },

    updatePositions(objects) {
      FermActions.updateNodeLocations(objects);
    },

    render: function() {
      return (
        <div className="cytoscape_graph"></div>
      )
    }
  });

module.exports = GraphPane;
