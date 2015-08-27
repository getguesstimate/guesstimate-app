'use strict'

import Reflux from 'reflux'
import React from 'react'
import _ from 'lodash'
import Button from 'react-bootstrap/Button'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import fermLocationStore from '../stores/locationstore'
import NodeForm from './node_form.jsx'
import Icon from'react-fa'

var Header = React.createClass({

  newEstimate () {
    this.props.addNode('estimate')
  },

  newFunction () {
    this.props.addNode('function')
  },

  render () {
    const unsaved = this.props.unsavedChanges
    const saveButton = <Button bsStyle={unsaved ? 'primary' : null} disabled={!unsaved} onClick={this.props.saveGraph}> Save </Button>
    return (
      <ButtonToolbar className="header">
        <Button onClick={this.newEstimate}> <Icon name='plus'/> Estimate </Button>
        <Button onClick={this.newFunction}> <Icon name='plus'/> Function </Button>
        {this.props.savable ? saveButton : null}
      </ButtonToolbar>
    )
  }
});

module.exports = Header
