import _ from "lodash";
import React from "react";

import { CanvasLocation } from "~/lib/locationUtils";
import { Edge } from "./Edge";
import { GridPoint } from "./gridPoints";

const allPathStatuses = [
  "default",
  "screenshot",
  "unconnected",
  "ancestor",
  "descendant",
  "ancestor-1-degree",
  "descendant-1-degree",
  "hasErrors",
] as const;

export type PathStatus = typeof allPathStatuses[number];

export const edgeColors: { [k in PathStatus]: string } = {
  default: "#899eb6",
  screenshot: "#809ab9",
  unconnected: "rgba(77, 121, 175, 0.06)",
  ancestor: "#95b6b2",
  "ancestor-1-degree": "#43796b",
  descendant: "#9eacbc",
  "descendant-1-degree": "#56687d",
  hasErrors: "#b59893",
};

export type EdgeShape = {
  input: CanvasLocation;
  output: CanvasLocation;
  pathStatus: PathStatus;
  hasErrors?: boolean;
};

type Props = {
  columnWidth: number;
  containerHeight: number;
  edges: EdgeShape[];
  rowHeights: number[];
};

const areEqual = (props: Props, nextProps: Props) => {
  return (
    props.columnWidth === nextProps.columnWidth &&
    props.containerHeight === nextProps.containerHeight &&
    _.isEqual(props.edges, nextProps.edges) &&
    _.isEqual(props.rowHeights, nextProps.rowHeights)
  );
};

export const Edges: React.FC<Props> = React.memo(
  ({ columnWidth, containerHeight, rowHeights, edges }) => {
    const gridPoint = new GridPoint({
      rowHeights,
      columnWidth,
      padding: 5,
    });

    return (
      <svg className="absolute top-0 z-0 w-full" height={containerHeight}>
        <defs>
          {allPathStatuses.map((pathStatus) => (
            <marker
              key={pathStatus}
              id={`MarkerArrow-${pathStatus}`}
              markerWidth="3"
              markerHeight="3"
              refX="2"
              refY="1.5"
              orient="auto"
            >
              <path
                d="M 0,0 V 3 L3,1.5 Z"
                fill={edgeColors[pathStatus]}
                strokeWidth={0}
              />
            </marker>
          ))}
        </defs>
        {_.sortBy(edges, (e) => {
          return e.pathStatus !== "unconnected" ? 2 : e.hasErrors ? 1 : 0;
        }).map((e) => (
          <Edge
            hasErrors={e.hasErrors}
            pathStatus={e.pathStatus}
            key={JSON.stringify(e)} // TODO - store a pair of metric ids in EdgeShape?
            input={gridPoint.rectangle(e.input)}
            output={gridPoint.rectangle(e.output)}
          />
        ))}
      </svg>
    );
  },
  areEqual
);
