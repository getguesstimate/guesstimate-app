'use strict';

var Backbone = require("backbone");
var [EstimateNode, DependentNode, FunctionNode] = require("../models/node_types");
require(['lodash'], function(_) {});

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
        default:
          return new Enode(attrs, options)
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
