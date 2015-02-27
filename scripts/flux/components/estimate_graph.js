//var cytoscape = require('cytoscape');
// var cytoscape = require("imports?require=>false!cytoscape");
    //window.cytoscape = cytoscape;

var maingraph = {};
var _ = require('../../lodash.min');


maingraph.create = function(el, inputNodes, inputEdges, mainfun, updatefun, isCreated){

  this.cy = cytoscape({
    container: el,
    userZoomingEnabled: false,
    style: cytoscape.stylesheet()
      .selector('node')
        .css({
          'font-weight': 'normal',
          'content': 'data(name)',
          'font-size': 14,
          'text-valign': 'center',
          'text-halign': 'center',
        })
      .selector('node[nodeType="function"]')
          .css({
            'background-color': '#fff',
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
            'background-color': '#fff',
            'text-outline-width': 4,
            'text-outline-color': '#fff'
        })
      .selector('node[nodeType="dependent"]')
          .css({
            'color': '#8E3C3A',
            'width': 80,
            'font-weight': 'bold',
            'height': 25,
            'background-color': '#fff',
            'text-outline-width': 4,
            'text-outline-color': '#fff'
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
      .selector('.highlighted')
        .css({
          'background-color': '#61bffc',
          'line-color': '#61bffc',
          'target-arrow-color': '#61bffc',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.5s'
        }),

    elements: {
        nodes: inputNodes,
        edges: inputEdges
      },
    layout: {
      name: 'breadthfirst',
      directed: true,
      padding: 10,
      avoidOverlap: true
    },
    ready: function(){
      //this.on('tap', function(event){
        //console.log(event)
        //console.log('tap event')
      //})
      //this.on('tapstart', function(event){
        //console.log(event)
        //console.log('tap start')
      //})
      this.on('drag', function(event){
        id = event.cyTarget.data().nodeId;
        position = event.cyTarget.renderedPosition()
        object = {id: id, renderedPosition: position}
        updatefun([object])
      })
      this.on('pan', function(event){
        var newLocations = _.map(event.cy.nodes(), function(n){return {id: n.data().nodeId, renderedPosition: n.renderedPosition()}})
        updatefun(newLocations)
      })
      this.on('cxttapend', function(event){
        data = event.cyTarget.data()
        if (data) {
          mainfun(data.nodeId)
        } else {
          mainfun(null)
        }
      });
      isCreated();
    }
  });

};

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

formatDiff = function(diff){
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


cytoChange = function(action, data){
  cy = maingraph.cy
  actions = {
    'modified': function(data){
      element = cy.getElementById(data.id);
      element.data(data)
    },
    'deleted': function(data){
      element = cy.getElementById(data.id);
      cy.remove(element)
    },
    'added': function(data){
      cy.add({group:"edges", data: data})
    }
  }
  actions[action](data)
}

//jsondiffpatch = require('jsondiffpatch')

foobar = function(older, newer, diffKey){
  differ = jsondiffpatch.create({objectHash(obj){return obj[diffKey]}})
  diff = differ.diff(older, newer)
  formatted = formatDiff(diff)
  formatted.modified.map( n => cytoChange('modified', newer[n]) )
  formatted.added.map( n => cytoChange('added', newer[n]) )
  formatted.deleted.map( n => cytoChange('deleted', older[n]) )
}

maingraph.update = function(inputNodes, inputEdges, callback){
  newData = {elements:{nodes: inputNodes, edges: inputEdges}}

  getAllData = nodes => nodes.map(node => node.data)
  oldData = this.cy.json()

  getTypeData = elementType => [oldData, newData].map( n => getAllData(n.elements[elementType]) )
  var [oldNodes, newNodes] = getTypeData('nodes')
  var [oldEdges, newEdges] = getTypeData('edges')

  nodeChanges = foobar(oldNodes, newNodes, 'nodeId')
  edgeChanges = foobar(oldEdges, newEdges, 'id')
}

module.exports = maingraph;
