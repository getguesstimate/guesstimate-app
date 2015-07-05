'use strict';

var Backbone = require("backbone"),
    EstimateNode = require("../models/estimate_node"),
    DependentNode = require("../models/dependent_node"),
    FunctionNode = require("../models/function_node");

var _ = require('lodash');

var NodeCollection = Backbone.Collection.extend({

    url: '/foo/bar',

    initialize(collection, graph){
      this.graph = graph;
    },

    model: function(attrs, options) {
      switch (attrs.nodeType){
        case 'estimate':
          return new EstimateNode(attrs, options)
        case 'dependent':
          return new DependentNode(attrs, options)
        case 'function':
          return new FunctionNode(attrs, options)
      }
    },

    toCytoscape() {
      var nodes = _.map(this.models, function(d){
        return d.toCytoscape();
      });
      return nodes;
    },

    allOfTtype(ttype){
      return  _.select(this.models, function(n){ return n.ttype() === ttype} )
    }
});

module.exports = NodeCollection;
