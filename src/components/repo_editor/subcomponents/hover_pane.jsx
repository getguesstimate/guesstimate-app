'use strict'

import Reflux from 'reflux'
import React from 'react'
import _ from 'lodash'
import fermLocationStore from '../stores/locationstore'
import NodeForm from './node_form.jsx'
import Icon from'react-fa'
import $ from 'jquery'

const HoverPane = React.createClass({
  mixins: [
    Reflux.connect(fermLocationStore, "nodeLocations")
  ],

  findHoverPosition () {
    let node = this.props.node
    if (node){
      let xOffset = (node.ttype() == 'function') ? 77 : 113
      let yOffset = (node.ttype() == 'function') ? 22 : 15
      var nodePosition = _.where(this.state.nodeLocations, {'id':node.id})
      if (nodePosition.length > 0){
        var renderedPosition = nodePosition[0].renderedPosition
        var hoverPosition = {left: renderedPosition.x - xOffset, top: renderedPosition.y + yOffset};
        return hoverPosition
      }
    }
  },

  render () {
    return (
      <div className="hover" style={this.findHoverPosition()}>
        <div className='triangle'></div>
        <NodeForm graph={this.props.graph} node={this.props.node} formSize="small" />
      </div>
    )
  }
});

module.exports = HoverPane
