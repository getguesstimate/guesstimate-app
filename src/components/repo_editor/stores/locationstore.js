'use strict';

import React from 'react'
import Reflux from 'reflux'
import FermActions from '../actions'
import _ from 'lodash'

var fermLocationStore = Reflux.createStore({
    listenables: [FermActions],
    _addNodeLocation (node) {
      this.nodeLocations.push(node)
    },
    _updateNodeLocation (node) {
      let item = this.getNodeLocation(node.id);
      if (item){
        item.renderedPosition = node.renderedPosition;
      }
      else {
        this._addNodeLocation(node)
      }
    },
    getNodeLocations () {
        return this.nodeLocations;
    },
    getNodeLocation (id) {
        return _.find(this.nodeLocations, function(n){return n.id == id});
    },
    onUpdateNodeLocations (nodeLocations) {
      _.map(nodeLocations, this._updateNodeLocation)
      this.trigger(this.nodeLocations)
    },
    onUpdateAllNodeLocations (nodeLocations) {
      this.nodeLocations = nodeLocations
      this.trigger(this.nodeLocations)
    },
    getInitialState () {
      this.nodeLocations = []
    }
})

module.exports = fermLocationStore;
