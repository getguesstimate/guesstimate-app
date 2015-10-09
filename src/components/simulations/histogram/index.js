import React, {Component, PropTypes} from 'react';
import Histogram from 'gComponents/lib/histogram';
import Dimensions from 'gComponents/utility/react-dimensions';
import './style.css'

class SimulationHistogram extends Component{
  shouldComponentUpdate(nextProps, nextState) {
    return (
      (nextProps.simulation !== this.props.simulation) ||
      (nextProps.containerWidth !== this.props.containerWidth)
    )
  }
  values(){
    return this.props.simulation ? this.props.simulation.sample.values : false
  };
  histogram() {
    return (
      <Histogram data={this.values()} width={this.props.containerWidth + 5} height={30}/>
    )
  };
  render() {
    if (this.values()){
      return (this.histogram())
    } else {
      return false
    }
  }
}

export default Dimensions()(SimulationHistogram)
