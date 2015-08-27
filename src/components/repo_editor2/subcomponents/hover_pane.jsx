'use strict'

import Reflux from 'reflux'
import React from 'react'
import _ from 'lodash'
import Icon from'react-fa'
import $ from 'jquery'

const HoverPane = React.createClass({
  render () {
    return (
      <div className="hover"}>
        <NodeForm graph={this.props.graph} node={this.props.node} formSize="small" />
      </div>
    )
  }
});

module.exports = HoverPane
