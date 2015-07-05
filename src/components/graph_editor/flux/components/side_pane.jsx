'use strict';

import React from 'react'
import NodeForm from './node_form.jsx'

const SidePane = React.createClass({
  render: function() {
    return (
      <div className="sidePane">
        <NodeForm graph={this.props.graph} node={this.props.node} formSize="large" />
      </div>
    );
  }
});

module.exports = SidePane
