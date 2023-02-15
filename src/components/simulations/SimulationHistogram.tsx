import _ from "lodash";
import React from "react";

import { Histogram, HistogramTheme } from "~/components/lib/histogram";
import { Simulation } from "~/modules/simulations/reducer";

type Props = {
  simulation: Simulation | null | undefined;
  cutOffRatio: number;
  hoveredXCoord?: number;
  allowHover?: boolean;
  bins?: number;
  showTicks?: boolean;
  theme?: HistogramTheme;
};

export const SimulationHistogram = React.forwardRef<{ xScale: any }, Props>(
  function SimulationHistogram({ simulation, ...histogramProps }, ref) {
    const sortedValues = _.get(simulation, "sample.sortedValues") || [];

    const hasValues = sortedValues && sortedValues.length > 1;
    if (!hasValues) {
      return null;
    }

    return <Histogram data={sortedValues} {...histogramProps} ref={ref} />;
  }
);
