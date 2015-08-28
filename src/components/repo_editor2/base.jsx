'use strict';

import React from 'react'
import Reflux from 'reflux'
import SpaceStore from './stores/spacestore.js'
import Actions from './actions'

import Input from 'react-bootstrap/lib/Input'
import Button from 'react-bootstrap/lib/Button'
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Icon from'react-fa'


const NormalEstimate = React.createClass({
  render() {
    return (
    <div className="point-estimate">
      Normal Estimate
    </div>
    )
  }
})

const PointEstimate = React.createClass({
  render() {
    return (
    <div className="point-estimate">
      point estimate
    </div>
    )
  }
})

const Estimate = React.createClass({
  //point, array, normal
  render() {
    return (
    <div className="estimate">
    <Tabs defaultActiveKey={1}>
      <Tab eventKey={1} title=<Icon name='circle'/>><PointEstimate estimate={this.props.estimate}/></Tab>
      <Tab eventKey={2} title=<Icon name='area-chart'/>><NormalEstimate estimate={this.props.estimate}/></Tab>
    </Tabs>
    </div>
    )
  }
})

const Funct = React.createClass({
  render() {
    return (
    <div className="funct">
      <Tabs defaultActiveKey={1}>
        <Tab eventKey={1} title=<Icon name='plus'/>>Add Things</Tab>
        <Tab eventKey={2} title=<Icon name='close'/>>Multiply Things</Tab>
      </Tabs>
    </div>
    )
  }
})

const Distribution = React.createClass({
  render() {
    return (
    <div className="distribution">
      {this.props.distribution.value}
    </div>
    )
  }
})

const Guesstimate = React.createClass({
  type() {
    let guesstimate = this.props.guesstimate
    if (guesstimate.estimate !== undefined){
       return <Estimate estimate={guesstimate.estimate}/>
    } else if (guesstimate.funct !== undefined){
       return <Funct funct={guesstimate.estimate}/>
    }
  },
  render() {
    return (
    <div className="guesstimate">
      {this.type()}
    </div>
    )
  }
})

const MetricWidget = React.createClass({
  propogate() {
    Actions.metricPropogate(this.props.metric.id)
  },
  render() {
    return (
    <div className="col-sm-3 metric">
      {this.props.metric.name}
      <div className="node-form">
        <Distribution distribution={this.props.metric.distribution()}/>
        <Guesstimate guesstimate={this.props.metric.guesstimates[0]}/>
        <Button bsSize='xsmall' onClick={this.propogate}>Propogate!</Button>
      </div>
    </div>
    )
  }
})

const GraphEditorBase = React.createClass({
  mixins: [
    Reflux.connect(SpaceStore, "space"),
  ],
  render () {
    return (
      <div className="row repo-component">
         {this.state.space.metrics.map((metric) => {
              return (
                <MetricWidget metric={metric} key={metric.id}/>
              )
            })}
      </div>
    );
  }
});

module.exports = GraphEditorBase;
