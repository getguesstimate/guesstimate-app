var cytoscape = require('cytoscape');
// var cytoscape = require("imports?require=>false!cytoscape");
    window.cytoscape = cytoscape;

var maingraph = {};


maingraph.create = function(el, inputNodes, inputEdges, mainfun, updatefun, isCreated){

  this.cy = cytoscape({
    container: el,
    style: cytoscape.stylesheet()
      .selector('node')
        .css({
          'content': 'data(name)',
          'font-size': 14,
          'text-valign': 'center',
          'text-halign': 'center',
        })
      .selector('node[type="function"]')
          .css({
            'background-color': '#fff',
            'color': '#8E3C3A',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': 30,
            'width': 40,
            'height': 40,
        })
      .selector('node[type="estimate"]')
          .css({
            'width': 80,
            'font-weight': 'bold',
            'height': 25,
            'color': '#444',
            'background-color': '#fff',
            'text-outline-width': 4,
            'text-outline-color': '#fff'
        })
      .selector('node[type="result"]')
          .css({
            'color': '#8E3C3A',
            'width': 80,
            'font-weight': 'bold',
            'height': 25,
            'background-color': '#fff',
            'text-outline-width': 4,
            'text-outline-color': '#fff'
        })
      .selector('edge')
        .css({
          'target-arrow-shape': 'triangle',
          'width': 2,
          'line-color': '#ddd',
          'target-arrow-color': '#666'
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
      this.on('tap', 'node', function(event){
        console.log('touched')
        id = event.cyTarget.data().nodeId;
        if (id !== undefined) {
          console.log('id is' + id)
          mainfun(id)
        }
      });
      this.on('free', 'node', function(event){
        id = event.cyTarget.data().nodeId;
        position = event.cyTarget.position()
        updatefun(id, position)
      });
      isCreated();
    }
  });

};
maingraph.update = function(inputNodes, inputEdges){
  this.cy.load({
    nodes: inputNodes,
    edges: inputEdges
  });
}

module.exports = maingraph;
