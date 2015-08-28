import React from 'react'
import SpaceActions from '../actions/space-actions'
import Button from 'react-bootstrap/lib/Button'
import Guesstimate from './canvas-guesstimate'
import Distribution from './canvas-distribution'
import Panel from 'react-bootstrap/lib/Panel'
import Icon from'react-fa'

const MetricWidget = React.createClass({
  propogate() {
    SpaceActions.metricPropogate(this.props.metric.id)
  },
  render() {
    let footer = <Guesstimate guesstimate={this.props.metric.guesstimates[0]} metricId={this.props.metric.id}/>
    return (
    <div className="col-sm-2 metric">
      <Panel footer={footer}>
        <Distribution distribution={this.props.metric.distribution()} metricId={this.props.metric.id} metricName={this.props.metric.name}/>
        <Button bsSize='xsmall' onClick={this.propogate}><Icon name='refresh'/></Button>
      </Panel>
    </div>
    )
  }
})

module.exports = MetricWidget;
