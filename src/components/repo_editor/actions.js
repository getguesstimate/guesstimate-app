'use strict';

import Reflux from 'reflux'

const FermActions = Reflux.createActions([
    "graphReset",
    "graphSave",

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
