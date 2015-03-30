'use strict';

var Edge = require('../models/edge');
var Backbone = require("backbone");
var _ = require('lodash');

var EdgeCollection = Backbone.Collection.extend( {

    model: Edge,
    url: '/foo/bar',

    initialize(collection, graph) {
      this.graph = graph
    },

    toCytoscape() {
      var edges = _.map(this.models, function(d) {
        return d.toCytoscape();
      });
      return edges;
    }
});

module.exports = EdgeCollection;
