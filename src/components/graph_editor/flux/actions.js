'use strict';

import React from 'react'
import Reflux from 'reflux'

const FermActions = Reflux.createActions([
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
