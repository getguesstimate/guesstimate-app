'use strict';

import Reflux from 'reflux'
import FermActions from '../actions'
import fermGraphStore from './fermgraphstore'

const fermEditingStore = Reflux.createStore({
    listenables: [FermActions],
    getInitialState () {
        this.editingNode = null;
        return this.editingNode;
    },
    // Getters
    getEditingNodeId () {
        return this.editingNode;
    },
    getEditingNode () {
        return fermGraphStore.getItem(this.editingNode);
    },

    // Setters
    onUpdateEditingNode (id) {
        this.updateEditingNode(id);
    },
    onResetEditingNode (id) {
        this.updateEditingNode(null);
    },

    // Helpers
    updateEditingNode (id) {
        this.editingNode = id;
        this.trigger(this.editingNode);
    }
});

module.exports = fermEditingStore;
