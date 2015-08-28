import React from 'react'
import Reflux from 'reflux'
import Icon from'react-fa'
import stats from 'stats-lite'
import Histogram from 'react-d3-histogram'
import Table from 'react-bootstrap/lib/table'

const ArrayDistribution = React.createClass({
  render() {
    let value = this.props.distribution.value
    return (
    <div className="distribution">
      <h2> {stats.mean(value).toFixed(2)} </h2>
    <Histogram data={value} width={150} height={40}/>
    <Table condensed hover>
      <tbody>
        <tr>
          <td> std </td>
          <td> {stats.stdev(value).toFixed(2)} </td>
        </tr>
        <tr>
          <td> 90th Percentile </td>
          <td> {stats.percentile(value, 0.90).toFixed(2)} </td>
        </tr>
        <tr>
          <td> Samples </td>
          <td> {value.length} </td>
        </tr>
      </tbody>
    </Table>
    </div>
    )
  }
})

const PointDistribution = React.createClass({
  render() {
    return (
    <div className="distribution">
      <Icon name='circle'/>
      {this.props.distribution.value}
    </div>
    )
  }
})

const NormalDistribution = React.createClass({
  render() {
    return (
    <div className="distribution">
      <Icon name='area-chart'/>
      {this.props.distribution.mean}
      +-
      {this.props.distribution.stdev}
    </div>
    )
  }
})

const Distribution = React.createClass({
  type() {
    let type = this.props.distribution.type
    if (type == 'point'){
      return <PointDistribution distribution={this.props.distribution}/>
    } else if (type == 'normal'){
      return <NormalDistribution distribution={this.props.distribution}/>
    } else if (type == 'array'){
      return <ArrayDistribution distribution={this.props.distribution}/>
    }
  },
  render() {
    return (
    <div className="distribution">
      {this.type()}
    </div>
    )
  }
})

module.exports = Distribution;
