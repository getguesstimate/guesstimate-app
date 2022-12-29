import _ from "lodash";
import React, { Component, useLayoutEffect, useState } from "react";

import $ from "jquery";

import { Edges } from "./edges";
import GridPoint from "./gridPoints";

import { EdgeShape } from "gComponents/spaces/canvas";
import { isRegion, MaybeRegion, Region } from "lib/locationUtils";

const Region: React.FC<{
  rowHeights: number[];
  columnWidth: number;
  selectedRegion: Region;
  type: string;
}> = ({ rowHeights, columnWidth, selectedRegion, type }) => {
  const gridPoint = new GridPoint({ rowHeights, columnWidth, padding: 0 });
  const region = gridPoint.region(selectedRegion);
  return <div className={`Region ${type}`} style={region} />;
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
      name: string,
      columnWidth: number
    ) => {
      if (isRegion(locations)) {
        return (
          <Region
            rowHeights={rowHeights}
            columnWidth={columnWidth}
            selectedRegion={locations}
            type={name}
            key={name}
          />
        );
      } else {
        return null;
      }
    };

    const getColumnWidth = () => {
      return $(".FlowGridCell") && $(".FlowGridCell")[0]
        ? $(".FlowGridCell")[0].offsetWidth
        : null;
    };

    const columnWidth = getColumnWidth();
    if (!columnWidth || !rowHeights.length) {
      return null;
    }

    const containerHeight = rowHeights.reduce((a, b) => a + b);

    const backgroundRegions: [MaybeRegion, string][] = [
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