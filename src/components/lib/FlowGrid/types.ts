import { Location } from "lib/locationUtils";
import React from "react";
import { GridContext } from "./filled-cell";

export type GridItem = {
  key: string;
  location: Location;
  component: (context: GridContext) => React.ReactElement;
  props: any;
};

export type CanvasState = any; // FIXME
