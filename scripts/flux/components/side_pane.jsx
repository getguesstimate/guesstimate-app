'use strict';

var React = require('react');
var NodeForm = require('./node_form.jsx');

var SidePane = React.createClass({
  render: function() {
    return (
      <div className="sidePane">
        <NodeForm graph={this.props.graph} node={this.props.node} formSize="large" />
      </div>
    );
  }
});

module.exports = 'foo'
