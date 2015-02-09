'use strict';

var Enodes = require('./enodes');
    Enode = require('./enode');
    Egraph = require('./egraph');

data = {
  nodes: [
    {id: 1, etype: 'estimate', eprops:{name: 'people in the Europe'}},
    {id: 2, etype: 'estimate', eprops:{name: 'people in the US'}},
    {id: 3, etype: 'function', eprops:{ftype: 'multiplication'}},
    {id: 3, etype: 'dependent', eprops:{name: 'people in World'}}
  ],
  edges: [
    [1,3],
    [2,3],
    [3,4]
  ]
}

Fgraph = new Egraph(data);
module.exports = Fgraph;
