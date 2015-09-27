import React, {Component, PropTypes} from 'react'
import Histogram from './histogram'

export default class SimulationHistogram extends Component{
  values(){
    return this.props.simulation ? this.props.simulation.sample.values : false
  };
  histogram() {
    return (
      <Histogram data={this.values()} width={400} height={60}/>
    )
  };
  render() {
    return (
      <div>
      {this.values() ? this.histogram() : false}
      </div>
    )
  }
}
