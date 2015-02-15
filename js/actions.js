var Reflux = require('reflux');

(function(Reflux, global) {
  'use strict';

  global.FermActions = Reflux.createActions([
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

})(window.Reflux, window);
