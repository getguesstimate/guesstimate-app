'use strict';

var NodeCollection = require('./nodecollection');
var EdgeCollection = require('./edgecollection');

class Egraph {
  constructor(args){
    this.nodes = new NodeCollection(args.nodes, this);
    this.edges = new EdgeCollection(args.edges, this);
  }
}

var data = {
  nodes: [
    {pid: 2, etype: 'estimate', eprops:{name: 'people in the Europe', value: 10}},
    {pid: 3, etype: 'estimate', eprops:{name: 'people in the US', value: 10}},
    {pid: 4, etype: 'function', eprops:{ftype: 'add'}},
    {pid: 5, etype: 'dependent', eprops:{name: 'people in World'}},
    {pid: 6, etype: 'function', eprops:{ftype: 'multiply'}},
    {pid: 7, etype: 'dependent', eprops:{name: 'people in Universe'}},
    {pid: 8, etype: 'estimate', eprops:{name: 'universe/person ratio', value: 200}},
    {pid: 9, etype: 'estimate', eprops:{name: 'other thing', value: 2}}
  ],
  edges: [
    [2,4],
    [3,4],
    [4,5],
    [5,6],
    [6,7],
    [8,6],
    [6,9]
  ]
}
var Fgraph = new Egraph(data);

module.exports = Fgraph;
