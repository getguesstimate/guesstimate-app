'use strict';

var React = require('react');
var Reflux = require('reflux');

var FermActions = Reflux.createActions([
    "chooseItem",
    "updateItem",
    "removeItem",
    "addItem",
    "updateList",
    "addFunction",
    "addEstimate",
    "updateEditingNode",
    "resetEditingNode"
]);

module.exports = FermActions;
