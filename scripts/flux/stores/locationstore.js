var React = require('react');
var Reflux = require('reflux');
var FermActions = require('../actions');
var _ = require('../../lodash.min');

var fermLocationStore = Reflux.createStore({
    listenables: [FermActions],
    getNodeLocations: function() {
        return this.nodeLocations;
    },
    onUpdateNodeLocations: function(nodeLocations){
      this.nodeLocations = nodeLocations
      this.trigger(this.nodeLocations)
    },
    getNode: function(nodeId){
      return this.graph.nodes.get(nodeId)
    },
    getNodes: function(){
        return this.list;
    },
    getInitialState: function() {
      this.nodeLocations = []
    }
})

module.exports = fermLocationStore;
