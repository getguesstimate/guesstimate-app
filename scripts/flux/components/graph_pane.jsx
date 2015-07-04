'use strict';

var _ = require('lodash');

var cytoscape = require('cytoscape')
var $ = require('jquery')
var React = require('react');
var Reflux = require('reflux');
var FermActions = require('../actions');
var Cytoscape = require('./cytoscape_graph');

var GraphPane = React.createClass( {
  handleReady(cytoscapeGraph){
    this.setState({graph: cytoscapeGraph})
    this.updateAllPositions(cytoscapeGraph)
  },
  handleChange(cytoscapeGraph){
    this.updateAllPositions(cytoscapeGraph)
  },
  handleDrag(event){
    var id = event.cyTarget.data().nodeId;
    var position = event.cyTarget.renderedPosition()
    var object = {id: id, renderedPosition: position}
    FermActions.updateNodeLocations([object])
  },
  handlePan(event){
    var newLocations = _.map(event.cy.nodes(), function(n){return {id: n.data().nodeId, renderedPosition: n.renderedPosition()}})
    FermActions.updateNodeLocations(objects);
  },
  handleTap(event){
    var data = event.cyTarget.data()
    if (data) {
      this.props.updateEditingNode(data.nodeId)
    } else {
      this.props.updateEditingNode(null)
    }
  },
  updateAllPositions: function(){
    var newLocations = _.map(this.state.graph.nodes(), function(n){return {id: n.data().nodeId, renderedPosition: n.renderedPosition()}})
    if (!isNaN(newLocations[0].renderedPosition.x)){
      FermActions.updateAllNodeLocations(newLocations);
    }
  },
  prepareEdges() {
    return this.props.graph.edges.toCytoscape()
  },
  prepareNodes() {
    var regular = this.props.graph.nodes.toCytoscape()
    if (this.props.editingNode) {
      var editingCytoscapeNode = _.find(regular, function(f){return f.data.nodeId == this.props.editingNode.id}, this)
      editingCytoscapeNode.data.editing = "true"
    }
    return regular
  },
  makeConfig() {
    var foo = {
      container: $('.cytoscape_graph')[0],
      userZoomingEnabled: true,
      maxZoom: 2,
      minZoom: 0.5,
      style: cytoscapeStyle,
      elements: {
        nodes: this.prepareNodes(),
        edges: this.prepareEdges()
      },
      layout: _.clone(mainLayout)
    }
    return foo
  },
  render(){
    return (
      <Cytoscape config={this.makeConfig()} nodes={this.prepareNodes()} edges={this.prepareEdges()} onDrag={this.handleDrag} onReady={this.handleReady} onChange={this.handleChange} onPan={this.handlePan} onTap={this.handleTap}/>
    )
  }
})

var mainLayout = {
      name: 'breadthfirst',
      directed: true, padding: 10,
      avoidOverlap: true
    }

var cytoscapeStyle = cytoscape.stylesheet()
  .selector('node')
    .css({
      'font-weight': 'normal',
      'content': 'data(name)',
      'font-size': 14,
      'text-valign': 'center',
      'text-halign': 'center',
      'background-color': '#fff',
      'text-outline-color': '#fff',
      'text-outline-width': 4,
    })
  .selector('node[nodeType="function"]')
      .css({
        'color': '#8E3C3A',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': 30,
        'width': 40,
        'height': 40,
    })
  .selector('node[nodeType="estimate"]')
      .css({
        'width': 80,
        'font-weight': 'bold',
        'height': 25,
        'color': '#444',
    })
  .selector('node[nodeType="dependent"]')
      .css({
        'color': '#8E3C3A',
        'width': 80,
        'font-weight': 'bold',
        'height': 25,
    })
  .selector('node[name="Add Name"]')
      .css({
        'color': 'red',
    })
  .selector('node[editing="true"]')
      .css({
        'color': '#1E8AE2',
    })
  .selector('edge')
    .css({
      'target-arrow-shape': 'triangle',
      'width': 2,
      'line-color': '#ddd',
      'target-arrow-color': '#666'
    })
  .selector('edge[toType="dependent"]')
    .css({
      'line-color': '#994343',
      'target-arrow-color': '#994343'
    })

module.exports = GraphPane;
