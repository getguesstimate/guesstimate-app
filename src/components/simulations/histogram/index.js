import React, {Component, PropTypes} from 'react';
import Histogram from 'gComponents/lib/histogram';
import Dimensions from 'gComponents/utility/react-dimensions';
import './style.css'
import _ from 'lodash'

const PT = PropTypes
class SimulationHistogram extends Component{
  static propTypes = {
    metricCardView: PT.oneOf([
      'normal',
      'scientific',
      'debugging',
    ]).isRequired,
    simulation: PT.object,
    containerWidth: PT.number
  }

  shouldComponentUpdate(nextProps) {
    return (
      (_.get(nextProps, 'simulation.stats') !== _.get(this.props, 'simulation.stats')) ||
      (nextProps.containerWidth !== this.props.containerWidth) ||
      (nextProps.metricCardView !== this.props.metricCardView)
    )
  }
  values(){
    return this.props.simulation ? this.props.simulation.sample.values : false
  };
  height() {
    return ((this.props.metricCardView === 'normal') ? 30 : 80)
  }
  histogram() {
    return (
      <Histogram data={this.values()}
          height={this.height()}
          width={this.props.containerWidth + 5}
      />
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
