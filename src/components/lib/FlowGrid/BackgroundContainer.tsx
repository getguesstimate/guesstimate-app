import React, { useLayoutEffect, useState } from "react";

import { Edges, EdgeShape } from "./Edges";
import { GridPoint } from "./gridPoints";

import { isRegion, MaybeRegion, Region } from "~/lib/locationUtils";
import clsx from "clsx";

type RegionType = "selected" | "analyzed" | "copied" | "fill";

const regionTypeToClass = {
  selected: "rounded-[3px] bg-[rgb(153,186,208)]/[0.87]",
  fill: "rounded-[3px] border border-dashed border-black/40",
  copied:
    "rounded-[3px] border-2 border-dashed border-[rgb(7,115,167)]/[0.75] bg-[rgb(153,186,208)]/[0.17]",
  analyzed:
    "bg-gradient-to-br from-[rgb(72,187,90)]/[0.66] to-[rgb(120,203,149)]/[0.65]",
};

const Region: React.FC<{
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

export const BackgroundContainer: React.FC<Props> = React.memo(
  ({
    rowCount,
    getRowHeight,
    edges,
    selectedRegion,
    copiedRegion,
    autoFillRegion,
    analyzedRegion,
  }) => {
    const [rowHeights, setRowHeights] = useState<number[]>([]);

    useLayoutEffect(() => {
      const newRowHeights = Array(rowCount)
        .fill(null)
        .map((_, i) => getRowHeight(i));

      setRowHeights(newRowHeights);
    }, [rowCount, getRowHeight]);

    const renderRegion = (
      locations: MaybeRegion,
      type: RegionType,
      columnWidth: number
    ) => {
      if (isRegion(locations)) {
        return (
          <Region
            rowHeights={rowHeights}
            columnWidth={columnWidth}
            selectedRegion={locations}
            type={type}
            key={type}
          />
        );
      } else {
        return null;
      }
    };

    const getColumnWidth = () => {
      const item = document.getElementsByClassName("FlowGridCell").item(0);
      return item ? (item as HTMLElement).offsetWidth : null;
    };

    const columnWidth = getColumnWidth();
    if (!columnWidth || !rowHeights.length) {
      return null;
    }

    const containerHeight = rowHeights.reduce((a, b) => a + b);

    const backgroundRegions: [MaybeRegion, RegionType][] = [
      [selectedRegion, "selected"],
      [analyzedRegion, "analyzed"],
      [copiedRegion, "copied"],
      [autoFillRegion, "fill"],
    ];

    return (
      <div>
        {backgroundRegions.map((region) =>
          renderRegion(region[0], region[1], columnWidth)
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
