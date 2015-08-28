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
    let foo = <Guesstimate guesstimate={this.props.metric.guesstimates[0]} metricId={this.props.metric.id}/>
    return (
    <div className="col-sm-3 metric">
      <Panel footer={foo}>
      <div className="row">
        <div className="col-sm-7">
          <Distribution distribution={this.props.metric.distribution()} metricId={this.props.metric.id}/>
        </div>
        <div className="col-sm-5">
          <h2>{this.props.metric.name}</h2>
          <Button bsSize='xsmall' onClick={this.propogate}><Icon name='refresh'/></Button>
        </div>
      </div>
      </Panel>
    </div>
    )
  }
})

module.exports = MetricWidget;
