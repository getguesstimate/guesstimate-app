'use strict';

var AbstractNode = require("./abstract_node");

class DependentNode extends AbstractNode {

  ttype() { return 'dependent' }

  inputFunction() {
    return this.inputs.nodes()[0]
  }

  propogate() {
    var newValue = this.inputFunction().calculate_output()
    this.set('value', newValue)
    this.outputs.nodes().map( e => e.propogate() )
  }
}


module.exports = DependentNode
