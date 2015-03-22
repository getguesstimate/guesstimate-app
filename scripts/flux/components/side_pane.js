'use strict';

var React = require('react');
var NodeForm = require('./node_form.js');

var SidePane = React.createClass({
  render() {
    return (
      <div className="sidePane">
        <NodeForm graph={this.props.graph} node={this.props.node} formSize="large" />
      </div>
    )
  }
});

module.exports = SidePane
