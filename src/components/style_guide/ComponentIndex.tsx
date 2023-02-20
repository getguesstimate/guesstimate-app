import React from "react";

import { MetricCard } from "~/components/metrics/card";
import { ComponentEditor } from "~/components/style_guide/ComponentEditor";

const MetricCardProps = {
  metric: {
    id: "123",
    space: 32,
    readableId: "AB",
    name: "Population of Chicago",
    location: { row: 3, column: 9 },
    guesstimate: {
      metric: "123",
      input: "3->8",
    },
    simulation: {
      metric: "123",
      sample: {
        errors: [],
        values: [30.3, 30.9, 31.9, 39.4, 50.3, 80.2],
      },
      stats: {
        mean: 40,
        stdev: 5,
        length: 6,
        adjustedConfidenceInterval: [20, 90],
      },
    },
    edges: [],
  },
  canvasState: "scientific",
  location: { row: 3, column: 3 },
  handleSelect: () => {
    console.log("select");
  },
  isSelected: true,
};

export const ComponentIndex: React.FC = () => {
  return (
    <ComponentEditor
      child={MetricCard}
      childProps={MetricCardProps as any}
      name="MetricCard"
    />
  );
};
