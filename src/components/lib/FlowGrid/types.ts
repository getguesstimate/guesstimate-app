import { CanvasLocation } from "~/lib/locationUtils";
import React from "react";
import { GridContext } from "./filled-cell";

export type GridItem = {
  key: string;
  location: CanvasLocation;
  component: (context: GridContext) => React.ReactElement;
  props: any;
};
