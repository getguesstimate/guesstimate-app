'use strict'

import Reflux from 'reflux'
import React from 'react'
import _ from 'lodash'
import fermLocationStore from '../stores/locationstore'
import NodeForm from './node_form.jsx'
import Icon from'react-fa'

const HoverPane = React.createClass({
  mixins: [
    Reflux.connect(fermLocationStore, "nodeLocations")
  ],

  findHoverPosition () {
    var node = this.props.node
    if (node){
      var nodePosition = _.where(this.state.nodeLocations, {'id':node.id})
      if (nodePosition.length > 0){
        var renderedPosition = nodePosition[0].renderedPosition
        var hoverPosition = {left: renderedPosition.x - 100, top: renderedPosition.y + 20};
        return hoverPosition
      }
    }
  },

  render () {
    return (
      <div className="hover" style={this.findHoverPosition()}> <NodeForm graph={this.props.graph} node={this.props.node} formSize="small" /> </div>
    )
  }
});

module.exports = HoverPane
