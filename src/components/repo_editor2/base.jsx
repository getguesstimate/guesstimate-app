'use strict';

import React from 'react'
import Reflux from 'reflux'
import Page from 'lib/large/page'
import Input from 'react-bootstrap/Input'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

let json = {
  monteCarlo: {
    samples: 10
  },
  metrics:
    [
      {id: '124', name: 'cats', guesstimates: [{ distribution: { type: 'point', value: 300 }, estimate: {value: 300} }] },
      {id: '125', name: 'dogs', guesstimates: [{ distribution: { type: 'point', value: 500 }, estimate: {value: 500} }] },
      {id: '126', name: 'animals', guesstimates: [{ distribution: {type: 'point', value: 40 }, funct: {inputs: ['124', '125'], function_type: 'addition'} }] },
      {id: '127', name: 'humans', guesstimates: [{ distribution: {type: 'point', value: 500 }, estimate: {value: 500} }] },
      {id: '128', name: 'beings', guesstimates: [{ distribution: {type: 'point', value: 40 }, funct: {inputs: ['126', '127'], function_type: 'addition'} }] }
    ]
};


const Estimate = React.createClass({
  //point, array, normal
  render() {
    return (
    <div className="estimate">
      <p> Select Distribution Type </p>
    </div>
    )
  }
})

const Funct = React.createClass({
  render() {
    return (
    <div className="funct">
      <h1> Functi </h1>
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
  render() {
    return (
    <div className="col-sm-3 metric">
      {this.props.metric.name}
      <div className="node-form">
        <Distribution distribution={this.props.metric.distribution()}/>
        <Guesstimate guesstimate={this.props.metric.guesstimates[0]}/>
      </div>
    </div>
    )
  }
})

let page = new Page(json)
const GraphEditorBase = React.createClass({
  render () {
    return (
      <div className="row repo-component">
         {page.metrics.map((metric) => {
              return (
                <MetricWidget metric={metric} key={metric.id}/>
              )
            })}
      </div>
    );
  }
});

module.exports = GraphEditorBase;
