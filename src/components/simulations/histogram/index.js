import React, { Component } from "react";
import PropTypes from "prop-types";

import Histogram from "gComponents/lib/histogram";

import Dimensions from "gComponents/utility/react-dimensions";

import "./style.css";

const PT = PropTypes;
class SimulationHistogram extends Component {
  static propTypes = {
    containerWidth: PT.number,
    height: PT.number,
    simulation: PT.object,
    cutOffRatio: PT.number,
  };

  static defaultProps = {
    bins: 40,
    widthPercent: 100,
  };

  shouldComponentUpdate(nextProps) {
    return (
      _.get(nextProps, "simulation.stats") !==
        _.get(this.props, "simulation.stats") ||
      nextProps.containerWidth !== this.props.containerWidth ||
      nextProps.height !== this.props.height ||
      nextProps.hoveredXCoord !== this.props.hoveredXCoord ||
      nextProps.allowHover !== this.props.allowHover
    );
  }

  sortedValues() {
    return _.get(this.props, "simulation.sample.sortedValues");
  }

  histogram() {
    const props = _.pick(this.props, [
      "height",
      "left",
      "bins",
      "cutOffRatio",
      "hoveredXCoord",
      "onChangeXScale",
      "allowHover",
    ]);
    return (
      <Histogram
        data={this.sortedValues()}
        width={(this.props.containerWidth * this.props.widthPercent) / 100}
        bottom={20}
        bins={this.props.bins}
        {...props}
      />
    );
  }

  render() {
    const sortedValues = this.sortedValues();
    const hasValues = sortedValues && sortedValues.length > 1;
    if (hasValues) {
      return this.histogram();
    } else {
      return false;
    }
  }
}

export default Dimensions()(SimulationHistogram);
