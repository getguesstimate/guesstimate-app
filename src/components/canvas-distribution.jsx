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
      <div className="row">
      <div className="col-sm-6">
        <h2 className='mean'> {stats.mean(value).toFixed(2)} </h2>
        <h2 className='metric-name'>{this.props.metricName}</h2>
      </div>
      <div className="col-sm-6">
        <Histogram data={value} width={100} height={60}/>
      </div>
      </div>
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
    let value = this.props.distribution.value
    return (
    <div className="distribution">
      <h2 className='mean'> {value} </h2>
      <h2 className='metric-name'>{this.props.metricName}</h2>
    </div>
    )
  }
})

const NormalDistribution = React.createClass({
  render() {
    let value = this.props.distribution.mean
    return (
    <div className="distribution">
      <h2 className='mean'> {value} </h2>
      <h2 className='metric-name'>{this.props.metricName}</h2>
      <Table condensed hover>
        <tbody>
          <tr>
            <td> std </td>
            <td> {this.props.distribution.stdev} </td>
          </tr>
        </tbody>
      </Table>
    </div>
    )
  }
})

const Distribution = React.createClass({
  type() {
    let type = this.props.distribution.type
    if (type == 'point'){
      return <PointDistribution {...this.props}/>
    } else if (type == 'normal'){
      return <NormalDistribution {...this.props}/>
    } else if (type == 'array'){
      return <ArrayDistribution {...this.props}/>
    }
  },
  render() {
    return (
    <div>
      {this.type()}
    </div>
    )
  }
})

module.exports = Distribution;
