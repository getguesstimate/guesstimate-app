import _ from "lodash";
import { Component } from "react";

import { Histogram } from "~/components/lib/histogram";

import { Dimensions } from "~/components/utility/Dimensions";

type Props = {
  height: number;
  simulation: any;
  cutOffRatio: number;
  hoveredXCoord?: number;
  allowHover?: boolean;
  widthPercent?: number;
  bins?: number;
  top?: number;
  bottom?: number;
  left?: number;
  onChangeXScale?(arg: any): void;
} & {
  containerWidth?: number;
  containerHeight?: number;
};

class SimulationHistogramWithDimentions extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      _.get(nextProps, "simulation.stats") !==
        _.get(this.props, "simulation.stats") ||
      nextProps.containerWidth !== this.props.containerWidth ||
      nextProps.height !== this.props.height ||
      nextProps.hoveredXCoord !== this.props.hoveredXCoord ||
      nextProps.allowHover !== this.props.allowHover
    );
  }

  sortedValues(): number[] {
    return _.get(this.props.simulation, "sample.sortedValues");
  }

  histogram() {
    const props = _.pick(this.props, [
      "height",
      "left",
      "cutOffRatio",
      "hoveredXCoord",
      "onChangeXScale",
      "allowHover",
    ]);
    const { widthPercent = 100, bins = 40 } = this.props;

    return (
      <Histogram
        data={this.sortedValues()}
        width={((this.props.containerWidth || 0) * widthPercent) / 100}
        bottom={20}
        bins={bins}
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

export const SimulationHistogram = Dimensions()(
  SimulationHistogramWithDimentions
);
