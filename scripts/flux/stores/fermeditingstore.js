var Reflux = require('reflux');
var FermActions = require('../actions');
var fermListStore = require('./fermliststore');

var fermEditingStore = Reflux.createStore({
    listenables: [FermActions],
    getInitialState: function(){
        this.editingNode = 3;
        return this.editingNode;
    },

    // Getters
    getEditingNodeId: function(){
        return this.editingNode;
    },
    getEditingNode: function(){
        return fermListStore.getItem(this.editingNode);
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
