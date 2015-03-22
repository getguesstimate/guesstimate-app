'use strict';

var _ = require('../../lodash.min');
var $ = require('jquery');
var React = require('react');
var Reflux = require('reflux');
var FermActions = require('../actions');
var cytoscapeGraph = require('../../cytoscape/cytoscape_graph');
window.cytoscapeGraph = cytoscapeGraph;

class CytoscapeAdapter {

  constructor(externalGraph, ccytoscapeGraph, updateEditingNode, editingNode){
    this.cytoscapeGraph = ccytoscapeGraph
    this.updateEditingNode = updateEditingNode
    this.externalGraph = externalGraph
    this.editingNode = editingNode
    this._cytoscapeInit()
  }

  cytoscapeDidMount() {
    this.externalUpdateAllPositions()
  }

  externalDidUpdate(){
    this.cytoscapeGraph.update(this._cytoscapePrepareNodes(), this._cytoscapePrepareEdges(), this.externalUpdateAllPositions);
  }

  externalUpdatePositions(objects) {
    FermActions.updateNodeLocations(objects);
  }

  externalUpdateAllPositions() {
    var newLocations = _.map(cytoscapeGraph.cy.nodes(), function(n){return {id: n.data().nodeId, renderedPosition: n.renderedPosition()}})
    if (!isNaN(newLocations[0].renderedPosition.x)) {
      FermActions.updateAllNodeLocations(newLocations);
    }
  }

  _cytoscapeInit() {
    var initialElements = {
        nodes: this._cytoscapePrepareNodes(),
        edges: this._cytoscapePrepareEdges()
      }
    var actions = { updateEditingNode: this.updateEditingNode, updatePositions: this.externalUpdatePositions, cytoscapeMounted: this.externalUpdateAllPositions }
    var el = $('.cytoscape_graph')[0];
    this.cytoscapeGraph.create(el, initialElements, actions);
  }

  _cytoscapePrepareEdges() {
    return this.externalGraph.edges.toCytoscape()
  }

  _cytoscapePrepareNodes() {
    var regular = this.externalGraph.nodes.toCytoscape()
    if (this.editingNode) {
      var editingCytoscapeNode = _.find(regular, function(f){return f.data.nodeId == this.editingNode.id}, this)
      editingCytoscapeNode.data.editing = "true"
    }
    return regular
  }
}

var GraphPane = React.createClass( {

  componentDidMount() {
    c = new CytoscapeAdapter(this.props.graph, cytoscapeGraph,  this.props.updateEditingNode, this.props.editingNode)
    this.setState({ adapter: c })
  },

  componentDidUpdate() {
    this.state.adapter.externalDidUpdate()
  },

  render: function() {
    return (
      <div className="cytoscape_graph"></div>
    )
  }
});

module.exports = GraphPane;
