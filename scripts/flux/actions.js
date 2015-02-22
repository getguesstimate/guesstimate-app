'use strict';

var React = require('react');
var Reflux = require('reflux');

var FermActions = Reflux.createActions([
    "chooseNode",
    "updateNode",
    "removeNode",
    "addNode",
    "updateNodes",
    "addFunction",
    "addEstimate",
    "updateEditingNode",
    "resetEditingNode",
    "updateNodeLocations"
]);

module.exports = FermActions;
