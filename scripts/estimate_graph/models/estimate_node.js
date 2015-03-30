'use strict';

var AbstractNode = require('./abstract_node');

class EstimateNode extends AbstractNode {

  ttype() { return 'estimate' }

  propogate() {
    this.outputs.nodes().map( e => e.propogate() )
  }
}

module.exports = EstimateNode
