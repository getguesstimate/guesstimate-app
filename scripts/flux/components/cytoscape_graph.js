'use strict';

var cytoscape_graph = {};
var _ = require('../../lodash.min');
var React = require('react');
var Reflux = require('reflux');
var FermActions = require('../actions');
var $ = require('jquery');

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

var CytoscapeGraph = React.createClass( {
  handleReady(cytoscapeGraph){
    this.setState({graph: cytoscapeGraph})
    this.updateAllPositions(cytoscapeGraph)
  },
  handleChange(cytoscapeGraph){
    this.updateAllPositions(cytoscapeGraph)
  },
  handleDrag(event){
    id = event.cyTarget.data().nodeId;
    position = event.cyTarget.renderedPosition()
    object = {id: id, renderedPosition: position}
    FermActions.updateNodeLocations([object])
  },
  handlePan(event){
    var newLocations = _.map(event.cy.nodes(), function(n){return {id: n.data().nodeId, renderedPosition: n.renderedPosition()}})
    FermActions.updateNodeLocations(objects);
  },
  handleTap(event){
    data = event.cyTarget.data()
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
    foo = {
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

var Cytoscape = React.createClass( {
  getDefaultProps:function(){
    return {
      config: {},
      nodes: {},
      edges: {},
      onDrag: function(){ return this },
      onTap: function(){ return this },
      onReady: function(){ return this },
      onChange: function(){ return this },
      ready: function(){}
    }
  },
  componentDidMount() {
    var cy = this.createCy()
    this.setState({cy: cy})
  },
  prepareConfig(){
    //foo = this
    that = this
    var defaults = {
      ready: function() {
        this.on('drag', function(e){
          that.props.onDrag(e)
        });
        this.on('tap', function(e){
          that.props.onTap(e)
        });
        this.on('pan', function(e){
          that.props.onPan(e)
        });
        that.props.onReady(this)
      }
    }
    return _.merge(defaults, this.props.config)
  },
  createCy(){
    tthis = this
    var config = this.prepareConfig()
    config.container = $('.cytoscape_graph')[0]
    var a = cytoscape(config)
    return a
  },
  render(){
    return (
      <div className="cytoscape_graph"></div>
    )
  }
})

cytoscape_graph.update = function(inputNodes, inputEdges, callback) {
  newData = {elements:{nodes: inputNodes, edges: inputEdges}}
  oldData = this.cy.json()

  getAllData = nodes => nodes.map(node => node.data)

  getTypeData = elementType => [oldData, newData].map( n => getAllData(n.elements[elementType] || []) )
  var [oldNodes, newNodes] = getTypeData('nodes')
  var [oldEdges, newEdges] = getTypeData('edges')

  nodeChanges = makeChanges(oldNodes, newNodes, 'nodeId')
  edgeChanges = makeChanges(oldEdges, newEdges, 'id')
  callback()
}

isArray = (typeof Array.isArray === 'function') ?
  // use native function
  Array.isArray :
  // use instanceof operator
  function(a) {
    return a instanceof Array;
  };

trimUnderscore = function(str) {
  if (str.substr(0, 1) === '_') {
    return str.slice(1);
  }
  return str;
};

isNode = data => (data.id.substr(0,1) === 'n')
isEdge = data => (data.source !== undefined)

getDeltaType = function(delta) {
  if (typeof delta === 'undefined') {
    return 'unchanged';
  }
  if (isArray(delta)) {
    if (delta.length === 1) {
      return 'added';
    }
    if (delta.length === 2) {
      return 'modified';
    }
    if (delta.length === 3 && delta[2] === 0) {
      return 'deleted';
    }
    if (delta.length === 3 && delta[2] === 2) {
      //text change
      return 'modified';
    }
  } else if (typeof delta === 'object') {
    // used to be 'node'
    return 'modified';
  }
  return 'unknown';
};

formatDiff = function(diff) {
  if (typeof diff === "undefined") {
    return {changed: [], deleted: []}
  }
  else {
    Ids = _.select(Object.keys(diff), function(n){ return !isNaN(trimUnderscore(n))})
    withType = Ids.map( n => getDeltaType(diff[n]) )

    getAll = diffType => _.select(Ids, function(n){ return getDeltaType(diff[n]) == diffType })
    getAllFormatted = all => getAll(all).map(f => trimUnderscore(f))

    byType = {}
    _.map(["added", "modified", "deleted"], function(n){ byType[n] = getAllFormatted(n) })
    return byType
  }
}


cytoChange = function(action, data) {
  cy = cytoscape_graph.cy
  actions = {
    'modified': function(data) {
      element = cy.getElementById(data.id);
      element.removeData()
      element.data(data)
    },
    'deleted': function(data) {
      element = cy.getElementById(data.id);
      cy.remove(element)
    },
    'added': function(data) {
      if (isNode(data)) {
        cy.add({group:"nodes", data: data, position: {x:1000, y:500}})
      }
      else if (isEdge(data)) {
        cy.add({group:"edges", data: data})
      }
    }
  }
  actions[action](data)
}

makeChanges = function(older, newer, diffKey) {
  differ = jsondiffpatch.create({objectHash(obj){return obj[diffKey]}})
  diff = differ.diff(older, newer)
  if (diff) {
    formatted = formatDiff(diff)
    formatted.modified.map( n => cytoChange('modified', newer[n]) )
    formatted.added.map( n => cytoChange('added', newer[n]) )
    formatted.deleted.map( n => cytoChange('deleted', older[n]) )
  }
}

module.exports = CytoscapeGraph;
