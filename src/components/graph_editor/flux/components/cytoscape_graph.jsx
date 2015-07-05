'use strict';

import cytoscape from 'cytoscape'
import jsondiffpatch from 'jsondiffpatch'
import _ from 'lodash'
import $ from 'jquery'
import React from 'react'

let cytoscape_graph = {}

const Cytoscape = React.createClass( {
  getDefaultProps:function(){
    return {
      config: {},
      nodes: {},
      edges: {},
      onDrag() { return this },
      onTap() { return this },
      onReady() { return this },
      onChange() { return this },
      ready() {}
    }
  },
  componentDidMount() {
    const cy = this.createCy()
    window.cytoscape_graph = cy
    this.setState({cy: cy})
  },
  componentDidUpdate() {
    const newData = {elements:{nodes: this.props.nodes, edges: this.props.edges}}
    const oldData = this.state.cy.json()

    const getAllData = nodes => nodes.map(node => node.data)

    const getTypeData = elementType => [oldData, newData].map( n => getAllData(n.elements[elementType] || []) )
    const [oldNodes, newNodes] = getTypeData('nodes')
    const [oldEdges, newEdges] = getTypeData('edges')

    const nodeChanges = makeChanges(oldNodes, newNodes, 'nodeId')
    const edgeChanges = makeChanges(oldEdges, newEdges, 'id')
  },
  prepareConfig(){
    let that = this
    const defaults = {
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
    const config = this.prepareConfig()
    config.container = $('.cytoscape_graph')[0]
    return cytoscape(config)
  },
  render(){
    return (
      <div className="cytoscape_graph"></div>
    )
  }
})

const isArray = (typeof Array.isArray === 'function') ?
  // use native function
  Array.isArray :
  // use instanceof operator
  function(a) {
    return a instanceof Array;
  };

const trimUnderscore = function(str) {
  if (str.substr(0, 1) === '_') {
    return str.slice(1);
  }
  return str;
};

const isNode = data => (data.id.substr(0,1) === 'n')
const isEdge = data => (data.source !== undefined)

const getDeltaType = function(delta) {
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

const formatDiff = function(diff) {
  if (typeof diff === "undefined") {
    return {changed: [], deleted: []}
  }
  else {
    const Ids = _.select(Object.keys(diff), function(n){ return !isNaN(trimUnderscore(n))})
    const withType = Ids.map( n => getDeltaType(diff[n]) )

    const getAll = diffType => _.select(Ids, function(n){ return getDeltaType(diff[n]) == diffType })
    const getAllFormatted = all => getAll(all).map(f => trimUnderscore(f))

    const byType = {}
    _.map(["added", "modified", "deleted"], function(n){ byType[n] = getAllFormatted(n) })
    return byType
  }
}

const cytoChange = function(action, data) {
  const cy = window.cytoscape_graph
  const actions = {
    'modified': function(data) {
      const element = cy.getElementById(data.id);
      element.removeData()
      element.data(data)
    },
    'deleted': function(data) {
      const element = cy.getElementById(data.id);
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

const makeChanges = function(older, newer, diffKey) {
  const differ = jsondiffpatch.create({objectHash(obj){return obj[diffKey]}})
  const diff = differ.diff(older, newer)
  if (diff) {
    const formatted = formatDiff(diff)
    formatted.modified.map( n => cytoChange('modified', newer[n]) )
    formatted.added.map( n => cytoChange('added', newer[n]) )
    formatted.deleted.map( n => cytoChange('deleted', older[n]) )
  }
}

module.exports = Cytoscape
