import React from "react";
import _ from "lodash";

import { EdgeShape } from "~/components/spaces/SpaceCanvas";
import { Edge } from "./Edge";
import { GridPoint } from "./gridPoints";

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
      <svg className="edge" height={containerHeight} width="100%">
        <defs>
          <marker
            id="MarkerArrow-ancestor"
            markerWidth="3"
            markerHeight="3"
            refX="2"
            refY="1.5"
            orient="auto"
          >
            <path d="M 0,0 V 3 L3,1.5 Z" className="arrow ancestor" />
          </marker>
          <marker
            id="MarkerArrow-ancestor-1-degree"
            markerWidth="3"
            markerHeight="3"
            refX="2"
            refY="1.5"
            orient="auto"
          >
            <path d="M 0,0 V 3 L3,1.5 Z" className="arrow ancestor-1-degree" />
          </marker>
          <marker
            id="MarkerArrow-descendant"
            markerWidth="3"
            markerHeight="3"
            refX="2"
            refY="1.5"
            orient="auto"
          >
            <path d="M 0,0 V 3 L3,1.5 Z" className="arrow descendant" />
          </marker>
          <marker
            id="MarkerArrow-descendant-1-degree"
            markerWidth="3"
            markerHeight="3"
            refX="2"
            refY="1.5"
            orient="auto"
          >
            <path
              d="M 0,0 V 3 L3,1.5 Z"
              className="arrow descendant-1-degree"
            />
          </marker>
          <marker
            id="MarkerArrow-unconnected"
            markerWidth="3"
            markerHeight="3"
            refX="2"
            refY="1.5"
            orient="auto"
          >
            <path d="M 0,0 V 3 L3,1.5 Z" className="arrow unconnected" />
          </marker>
          <marker
            id="MarkerArrow-default"
            markerWidth="3"
            markerHeight="3"
            refX="2"
            refY="1.5"
            orient="auto"
          >
            <path d="M 0,0 V 3 L3,1.5 Z" className="arrow default" />
          </marker>
          <marker
            id="MarkerArrow-hasErrors"
            markerWidth="3"
            markerHeight="3"
            refX="2"
            refY="1.5"
            orient="auto"
          >
            <path d="M 0,0 V 3 L3,1.5 Z" className="arrow hasErrors" />
          </marker>
        </defs>
        {_.sortBy(edges, (e) => {
          return e.pathStatus !== "unconnected" ? 2 : e.hasErrors ? 1 : 0;
        }).map((e) => {
          const input = gridPoint.rectangle(e.input);
          const output = gridPoint.rectangle(e.output);
          return (
            <Edge
              hasErrors={e.hasErrors}
              pathStatus={e.pathStatus}
              key={JSON.stringify(e)}
              input={input}
              output={output}
            />
          );
        })}
      </svg>
    );
  },
  areEqual
);
