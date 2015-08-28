import React from 'react'
import Reflux from 'reflux'
import Icon from'react-fa'
import stats from 'stats-lite'
import Histogram from 'react-d3-histogram'

const ArrayDistribution = React.createClass({
  render() {
    let value = this.props.distribution.value
    return (
    <div className="distribution">
    <Histogram data={value} width={'200'} height={40}/>

      <Icon name='bar-chart'/>
      <h3>{stats.mean(value)}</h3>
      {stats.stdev(value)}
      - {value.length}
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
