'use strict';

import Reflux from 'reflux'

const SpaceActions = Reflux.createActions([
    "spaceReset",
    "spaceSave",

    "metricSelect",
    "metricUpdate",
    "metricDestroy",
    "metricCreate",
    "metricPropogate",

    "functionAdd",
    "estimateAdd",

    "metricLocationUpdate",
    "pageLocationUpdate"
]);

module.exports = SpaceActions;
