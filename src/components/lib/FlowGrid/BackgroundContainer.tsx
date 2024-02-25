import React, { FC, memo, useContext, useLayoutEffect, useState } from "react";

import clsx from "clsx";
import { isRegion, MaybeRegion, Region } from "~/lib/locationUtils";

import { Edges, EdgeShape } from "./Edges";
import { cellSizeInfo, FlowGridContext } from "./FlowGrid";
import { GridPoint } from "./gridPoints";

type RegionType = "selected" | "analyzed" | "copied" | "fill";

const regionTypeToClass: Record<RegionType, string> = {
  selected: "rounded-[3px] bg-[rgb(153,186,208)]/[0.87]",
  fill: "rounded-[3px] border border-dashed border-black/40",
  copied:
    "rounded-[3px] border-2 border-dashed border-[rgb(7,115,167)]/[0.75] bg-[rgb(153,186,208)]/[0.17]",
  analyzed:
    "bg-gradient-to-br from-[rgb(72,187,90)]/[0.66] to-[rgb(120,203,149)]/[0.65]",
};

const Region: FC<{
  rowHeights: number[];
  columnWidth: number;
  selectedRegion: Region;
  type: RegionType;
}> = ({ rowHeights, columnWidth, selectedRegion, type }) => {
  const gridPoint = new GridPoint({ rowHeights, columnWidth, padding: 0 });
  const region = gridPoint.region(selectedRegion);
  return (
    <div className={clsx("absolute", regionTypeToClass[type])} style={region} />
  );
};

type Props = {
  rowCount: number;
  edges: EdgeShape[];
  selectedRegion: MaybeRegion;
  copiedRegion: MaybeRegion;
  analyzedRegion: MaybeRegion;
  autoFillRegion: MaybeRegion;
  getRowHeight(row: number): number;
};

export const BackgroundContainer: FC<Props> = memo(
  function BackgroundContainer({
    rowCount,
    getRowHeight,
    edges,
    selectedRegion,
    copiedRegion,
    autoFillRegion,
    analyzedRegion,
  }) {
    const [rowHeights, setRowHeights] = useState<number[]>([]);

    const { size } = useContext(FlowGridContext);

    useLayoutEffect(() => {
      const newRowHeights = Array(rowCount)
        .fill(null)
        .map((_, i) => getRowHeight(i));

      setRowHeights(newRowHeights);
    }, [rowCount, getRowHeight]);

    if (!rowHeights.length) {
      return null; // not initialized yet
    }

    const columnWidth = cellSizeInfo[size].width;
    const containerHeight = rowHeights.reduce((a, b) => a + b);

    const backgroundRegions: [MaybeRegion, RegionType][] = [
      [selectedRegion, "selected"],
      [analyzedRegion, "analyzed"],
      [copiedRegion, "copied"],
      [autoFillRegion, "fill"],
    ];

    return (
      <div>
        {backgroundRegions.map(([region, type]) =>
          isRegion(region) ? (
            <Region
              key={type}
              rowHeights={rowHeights}
              columnWidth={columnWidth}
              selectedRegion={region}
              type={type}
            />
          ) : null
        )}

        {edges.length > 0 && (
          <Edges
            columnWidth={columnWidth}
            containerHeight={containerHeight}
            edges={edges}
            rowHeights={rowHeights}
          />
        )}
      </div>
    );
  }
);
