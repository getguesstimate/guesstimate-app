import _ from "lodash";
import React, { useRef, useState } from "react";
import { DistributionSummary } from "~/components/distributions/summary/index";
import { SimulationHistogram } from "~/components/simulations/SimulationHistogram";
import { cutoff, percentile } from "~/lib/dataAnalysis";
import { Simulation } from "~/modules/simulations/reducer";

const MARGIN_LEFT = 10;

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
    <h3>Percentiles</h3>
    <table className="border-collapse">
      <tbody>
        {!_.isEmpty(values) &&
          percentages(values, [1, 5, 50, 95, 99]).map((e) => {
            return (
              <tr
                key={e.percentage}
                className="border-b border-black/10 last:border-none"
              >
                <td className="p-1 text-grey-666 border-r border-black/10">
                  {e.percentage}%
                </td>
                <td className="p-1 text-grey-666">
                  {e.value && e.value.toFixed(3)}
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
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
  const [xScale, setXScale] = useState(() => (i) => i);

  const divRef = useRef<HTMLDivElement | null>(null);

  const onMouseHover = (event: React.MouseEvent) => {
    const div = divRef.current;
    if (!div) {
      return; // shouldn't happen
    }
    const bounds = div.getBoundingClientRect();
    const x = event.clientX - bounds.left - MARGIN_LEFT;
    setHoveredXCoord(x);
    setIsHovering(true);
  };

  const changeXScale = (xScale: (i: number) => number) => {
    setXScale(() => xScale);
  };

  let hoveredValue: number | undefined, hoveredPercentile: number | undefined;
  if (isHovering) {
    hoveredValue = xScale(hoveredXCoord);
    hoveredPercentile = findPercentile(sortedSampleValues, hoveredValue!);
  }
  return (
    <div
      className="relative"
      ref={divRef}
      onMouseMove={onMouseHover}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex justify-between gap-8">
        <div className="mean z-10 flex-1 flex justify-between gap-4">
          <DistributionSummary
            length={stats.length}
            mean={stats.mean}
            adjustedConfidenceInterval={stats.adjustedConfidenceInterval}
          />
          {isHovering && (
            <div>
              <div className="text-grey-444 font-extralight text-3xl">
                {hoveredValue!.toFixed(2)}
              </div>
              <div className="text-grey-888 font-extralight mt-2">
                {(hoveredPercentile! * 100).toFixed(2)}th percentile
              </div>
            </div>
          )}
        </div>
        <div className="z-10">
          <PercentileTable values={sortedSampleValues} />
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-[-20px]">
        <SimulationHistogram
          height={150}
          top={0}
          bottom={0}
          bins={100}
          widthPercent={80}
          cutOffRatio={0.98}
          left={MARGIN_LEFT}
          simulation={simulation}
          allowHover={isHovering}
          hoveredXCoord={hoveredXCoord}
          onChangeXScale={changeXScale}
        />
      </div>
    </div>
  );
};
