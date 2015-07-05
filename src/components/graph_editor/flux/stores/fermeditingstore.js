'use strict';

var Reflux = require('reflux');
var FermActions = require('../actions');
var fermGraphStore = require('./fermgraphstore');

var fermEditingStore = Reflux.createStore({
    listenables: [FermActions],
    getInitialState: function(){
        this.editingNode = null;
        return this.editingNode;
    },
    // Getters
    getEditingNodeId: function(){
        return this.editingNode;
    },
    getEditingNode: function(){
        return fermGraphStore.getItem(this.editingNode);
    },

    // Setters
    onUpdateEditingNode: function(id) {
        this.updateEditingNode(id);
    },
    onResetEditingNode: function(id) {
        this.updateEditingNode(null);
    },

    // Helpers
    updateEditingNode: function(id) {
        this.editingNode = id;
        this.trigger(this.editingNode);
    }
});

module.exports = fermEditingStore;
