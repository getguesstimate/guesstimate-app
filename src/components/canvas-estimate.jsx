import React from 'react'
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Icon from'react-fa'
import Input from 'react-bootstrap/lib/Input'
import SpaceActions from '../actions/space-actions'
import $ from 'jquery'

const NormalEstimate = React.createClass({

  handleChange(evt) {
    const form_values = $(evt.target.parentElement.childNodes).filter(":input");
    let values = {};
    values[form_values[0].name] = form_values.val();
    SpaceActions.metricUpdateEstimate(this.props.metricId, values)
  },

  render() {
    let distribution = this.props.estimate.distribution
    return (
    <div className="point-estimate">
      <form key={this.props.estimate.mean} onChange={this.handleChange}>
        <Input key="mean" type="number" label="mean" name="mean" defaultValue="0" value={distribution.mean} />
        <Input key="stdev" type="number" label="stdev" name="stdev" defaultValue="0" value={distribution.stdev} />
      </form>
    </div>
    )
  }
})

const PointEstimate = React.createClass({
  handleChange(evt) {
    const form_values = $(evt.target.parentElement.childNodes).filter(":input");
    let values = {};
    values[form_values[0].name] = form_values.val();
    SpaceActions.metricUpdateEstimate(this.props.metricId, values)
  },

  render() {
    let distribution = this.props.estimate.distribution
    return (
    <div className="point-estimate">
      <form key={this.props.estimate.value} onChange={this.handleChange}>
        <Input key="value" type="number" label="value" name="value" defaultValue="0" value={distribution.value} />
      </form>
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
        <Tab eventKey={1} title=<Icon name='circle'/>><PointEstimate {...this.props} estimate={this.props.estimate}/></Tab>
        <Tab eventKey={2} title=<Icon name='area-chart'/>><NormalEstimate {...this.props} estimate={this.props.estimate}/></Tab>
      </Tabs>
    </div>
    )
  }
})

module.exports = Estimate;
