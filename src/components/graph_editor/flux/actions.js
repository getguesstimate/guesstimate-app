'use strict';

var React = require('react');
var Reflux = require('reflux');

var FermActions = Reflux.createActions([
    "graphReset",
    "chooseNode",
    "updateNode",
    "removeNode",
    "addNode",
    "updateNodes",
    "addFunction",
    "addEstimate",
    "updateEditingNode",
    "resetEditingNode",
    "updateAllNodeLocations",
    "updateNodeLocations"
]);

module.exports = FermActions;
