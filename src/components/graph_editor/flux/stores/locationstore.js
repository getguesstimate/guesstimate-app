'use strict';

var React = require('react');
var Reflux = require('reflux');
var FermActions = require('../actions');
var _ = require('lodash');

var fermLocationStore = Reflux.createStore({
    listenables: [FermActions],
    _addNodeLocation: function(node) {
      this.nodeLocations.push(node)
    },
    _updateNodeLocation: function(node){
      var item = this.getNodeLocation(node.id);
      if (item){
        item.renderedPosition = node.renderedPosition;
      }
      else {
        this._addNodeLocation(node)
      }
    },
    getNodeLocations: function() {
        return this.nodeLocations;
    },
    getNodeLocation: function(id) {
        return _.find(this.nodeLocations, function(n){return n.id == id});
    },
    onUpdateNodeLocations: function(nodeLocations){
      _.map(nodeLocations, this._updateNodeLocation)
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
