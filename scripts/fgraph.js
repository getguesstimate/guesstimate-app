'use strict';

var Egraph = require('./egraph');

data = {
  nodes: [
    {pid: 2, etype: 'estimate', eprops:{name: 'people in the Europe'}},
    {pid: 3, etype: 'estimate', eprops:{name: 'people in the US'}},
    {pid: 4, etype: 'function', eprops:{ftype: 'multiplication'}},
    {pid: 5, etype: 'dependent', eprops:{name: 'people in World'}}
  ],
  edges: [
    [1,3],
    [2,3],
    [3,4]
  ]
}

Fgraph = new Egraph(data);
module.exports = Fgraph;
