import React from 'react'
import Reflux from 'reflux'
import Icon from'react-fa'
import stats from 'stats-lite'
import Histogram from 'react-d3-histogram'
import Table from 'react-bootstrap/lib/table'
import SpaceActions from '../actions/space-actions'
import Button from 'react-bootstrap/lib/Button'

var ContentEditable = React.createClass({
    render: function(){
        return <div id="contenteditable"
            onInput={this.emitChange}
            onBlur={this.emitChange}
            contentEditable
            dangerouslySetInnerHTML={{__html: this.props.html}}></div>;
    },

    shouldComponentUpdate: function(nextProps){
        return nextProps.html !== this.getDOMNode().innerHTML;
    },

    componentDidUpdate: function() {
        if ( this.props.html !== this.getDOMNode().innerHTML ) {
           this.getDOMNode().innerHTML = this.props.html;
        }
    },

    emitChange: function(evt){
        var html = this.getDOMNode().innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {
            evt.target = { value: html };
            this.props.onChange(evt);
        }
        this.lastHtml = html;
    }
});

const MetricName = React.createClass({
  handleChange: function(evt){
    SpaceActions.metricUpdate(this.props.metricId, {name: evt.target.value})
  },

  render() {
    let value = this.props.distribution.value
    return (
      <h2 className='metric-name'>
        <ContentEditable html={this.props.metricName} onChange={this.handleChange}/>
      </h2>
    )
  }
})

const ArrayDistribution = React.createClass({
  propogate() {
    SpaceActions.metricPropogate(this.props.metricId)
  },
  render() {
    let value = this.props.distribution.value
    return (
    <div className="distribution">
      <div className="row">
      <div className="col-sm-6">
        <h2 className='mean'> {stats.mean(value).toFixed(2)} </h2>
        <MetricName {...this.props}/>
      </div>
      <div className="col-sm-6">
        <Histogram data={value} width={100} height={60}/>
        <Button className='refresh-calculation' bsSize='xsmall' onClick={this.propogate}><Icon name='refresh'/></Button>
      </div>
      </div>
    <Table bordered responsive condensed hover>
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
      <MetricName {...this.props}/>
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
      <MetricName {...this.props}/>
      <Table bordered responsive condensed hover>
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
