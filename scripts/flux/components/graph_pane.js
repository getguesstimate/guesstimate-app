'use strict';

var _ = require('../../lodash.min');
var $ = require('jquery');
var React = require('react');
var Reflux = require('reflux');
var FermActions = require('../actions');
var maingraph = require('./estimate_graph');
window.maingraph = maingraph;

  var GraphPane = React.createClass( {
    formatNodes: function() {
      var regular = this.props.graph.nodes.toCytoscape()
      if (this.props.editingNode) {
        var editingCytoscapeNode = _.find(regular, function(f){return f.data.nodeId == this.props.editingNode.id}, this)
        editingCytoscapeNode.data.editing = "true"
      }
      return regular
    },
    formatEdges: function() {
      return this.props.graph.edges.toCytoscape()
    },
    updateAllPositions: function() {
      var newLocations = _.map(maingraph.cy.nodes(), function(n){return {id: n.data().nodeId, renderedPosition: n.renderedPosition()}})
      if (!isNaN(newLocations[0].renderedPosition.x)) {
        FermActions.updateAllNodeLocations(newLocations);
      }
    },
    cytoscapeMounted: function() {
      this.updateAllPositions()
    },
    componentDidMount: function() { var el = $('.maingraph')[0];
      var initialElements = {
          nodes: this.formatNodes(),
          edges: this.formatEdges()
        }
      var actions = { updateEditingNode: this.props.updateEditingNode, updatePositions: this.updatePositions, cytoscapeMounted: this.cytoscapeMounted }
      maingraph.create(el, initialElements, actions);
    },
    componentDidUpdate: function() {
      maingraph.update(this.formatNodes(), this.formatEdges(), this.updateAllPositions);
    },
    updatePositions: function(objects) {
      FermActions.updateNodeLocations(objects);
    },
    render: function() {
      return (
        <div className="maingraph"></div>
      )
    }
  });


module.exports = GraphPane;
