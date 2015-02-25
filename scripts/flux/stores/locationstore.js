var React = require('react');
var Reflux = require('reflux');
var FermActions = require('../actions');
var _ = require('../../lodash.min');

var fermLocationStore = Reflux.createStore({
    listenables: [FermActions],
    getNodeLocations: function() {
        return this.nodeLocations;
    },
    getNodeLocation: function(id) {
        return _.find(this.nodeLocations, function(n){return n.id == id});
    },
    onUpdateNodeLocations: function(nodeLocations){
      _.map(nodeLocations, function(n){
        var item = this.getNodeLocation(n.id);
        item.renderedPosition = n.renderedPosition;
      }, this)
      this.trigger(this.nodeLocations)
    },
    onUpdateAllNodeLocations: function(nodeLocations){
      this.nodeLocations = nodeLocations
      this.trigger(this.nodeLocations)
    },
    getInitialState: function() {
      this.nodeLocations = []
    }
})

module.exports = fermLocationStore;
