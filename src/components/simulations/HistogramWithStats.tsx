import clsx from "clsx";
import _ from "lodash";
import React, { useRef, useState } from "react";
import { DistributionSummary } from "~/components/distributions/summary/index";
import { SimulationHistogram } from "~/components/simulations/SimulationHistogram";
import { cutoff, percentile } from "~/lib/dataAnalysis";
import { Simulation } from "~/modules/simulations/reducer";

const percentages = (values: number[], perc: number[]) => {
  return perc.map((e) => {
    return { percentage: e, value: percentile(values, values.length, e) };
  });
};

const findPercentile = (values: number[], value: number) => {
  return cutoff(values, value) / values.length;
};

const PercentileTable: React.FC<{ values: any }> = ({ values }) => (
  <div>
    <h3 className="text-grey-999 font-normal text-xl">Percentiles</h3>
    <table className="border-collapse">
      <tbody>
        {!_.isEmpty(values) &&
          percentages(values, [1, 5, 50, 95, 99]).map((e) => {
            return (
              <tr
                key={e.percentage}
                className="border-b border-black/10 last:border-none"
              >
                <td className="p-1 pl-0 text-grey-666 text-sm border-r border-black/10">
                  {e.percentage}%
                </td>
                <td className="p-1 text-grey-666 text-sm">
                  {e.value && e.value.toFixed(3)}
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  </div>
);

const HoverInfo: React.FC<{ value: number; percentile: number }> = ({
  value,
  percentile,
}) => (
  <div>
    <div className="text-grey-444 font-extralight text-3xl">
      {value.toFixed(2)}
    </div>
    <div className="text-grey-888 font-extralight text-sm mt-1">
      {(percentile * 100).toFixed(2)}th percentile
    </div>
  </div>
);

type Props = {
  simulation?: Simulation | null | undefined;
  stats: any;
  sortedSampleValues: number[];
};

export const HistogramWithStats: React.FC<Props> = ({
  stats,
  simulation,
  sortedSampleValues,
}) => {
  const [hoveredXCoord, setHoveredXCoord] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const divRef = useRef<HTMLDivElement | null>(null);

  const histogramRef = useRef<{ xScale: any }>(null);

  const onMouseHover = (event: React.MouseEvent) => {
    const div = divRef.current;
    if (!div) {
      return; // shouldn't happen
    }
    const bounds = div.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    setHoveredXCoord(x);
    setIsHovering(true);
  };

  const renderHoverInfo = () => {
    if (!histogramRef.current) {
      return;
    }
    const hoveredValue = histogramRef.current.xScale.invert(hoveredXCoord);
    const hoveredPercentile = findPercentile(sortedSampleValues, hoveredValue!);
    return <HoverInfo value={hoveredValue} percentile={hoveredPercentile} />;
  };

  return (
    <div className="flex justify-between gap-8">
      <div
        className="relative flex-1"
        ref={divRef}
        onMouseMove={onMouseHover}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className={clsx(`absolute left-0 right-0 bottom-0 h-[150px]`)}>
          <SimulationHistogram
            bins={100}
            cutOffRatio={0.98}
            simulation={simulation}
            allowHover={isHovering}
            hoveredXCoord={hoveredXCoord}
            showTicks
            theme="dark"
            ref={histogramRef}
          />
        </div>
        <div className="z-10 flex justify-between gap-4 relative">
          <DistributionSummary
            length={stats.length}
            mean={stats.mean}
            adjustedConfidenceInterval={stats.adjustedConfidenceInterval}
            theme="large"
          />
          {isHovering && renderHoverInfo()}
        </div>
      </div>
      <PercentileTable values={sortedSampleValues} />
    </div>
  );
};
