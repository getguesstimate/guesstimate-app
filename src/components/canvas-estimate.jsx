import React from 'react'
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'

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

module.exports = NormalEstimate;
