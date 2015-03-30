'use strict';

var Reflux = require('reflux');
var React = require('react');
var _ = require('lodash');
var ReactBootstrap = require('react-bootstrap');
var Button = require('react-bootstrap/Button');

var FermActions = require('../actions');
var fermLocationStore = require('../stores/locationstore');
var NodeForm = require('./node_form.jsx');

var EditorPane = React.createClass({

  mixins: [
    Reflux.connect(fermLocationStore, "nodeLocations")
  ],

  findHoverPosition() {
    var node = this.props.node
    if (node){
      var nodePosition = _.where(this.state.nodeLocations, {'id':node.id})
      if (nodePosition.length > 0){
        var renderedPosition = nodePosition[0].renderedPosition
        var hoverPosition = {left: renderedPosition.x - 85, top: renderedPosition.y + 20};
        return hoverPosition
      }
    }
  },

  render() {
    var node = this.props.node
    if (this.props.node){
      var hover_form = <div className="hover" style={this.findHoverPosition()}> <NodeForm graph={this.props.graph} node={this.props.node} formSize="small" /> </div>
    }
    else {
      var hover_form = ''
    }
    return (
      <div className="editorpane">
        {hover_form}
        <NewButtonPane addNode={this.props.addNode}/>
      </div>
    )
  }
});

var NewButtonPane = React.createClass({

  newEstimate() {
    this.props.addNode('estimate')
  },

  newFunction() {
    this.props.addNode('function')
  },

  render() {
    return (
      <div className="newButtons">
        <Button onClick={this.newEstimate}> New Estimate </Button>
        <Button onClick={this.newFunction}> New Function </Button>
      </div>
    )
  }
});

module.exports = EditorPane
