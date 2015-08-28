import React from 'react'
import SpaceActions from '../actions/space-actions'
import Button from 'react-bootstrap/lib/Button'
import Guesstimate from './canvas-guesstimate'
import Distribution from './canvas-distribution'

const MetricWidget = React.createClass({
  propogate() {
    SpaceActions.metricPropogate(this.props.metric.id)
  },
  render() {
    return (
    <div className="col-sm-3 metric">
      <h2>{this.props.metric.name}</h2>
      <div className="node-form">
        <Distribution distribution={this.props.metric.distribution()}/>
        <Guesstimate guesstimate={this.props.metric.guesstimates[0]}/>
        <Button bsSize='xsmall' onClick={this.propogate}>Propogate!</Button>
      </div>
    </div>
    )
  }
})

module.exports = MetricWidget;
