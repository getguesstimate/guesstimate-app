import React, {Component, PropTypes} from 'react';
import Histogram from 'gComponents/lib/histogram';

export default class SimulationHistogram extends Component{
  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.simulation !== this.props.simulation);
  }
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
