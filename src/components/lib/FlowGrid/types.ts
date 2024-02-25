import { ReactElement } from "react";

import { CanvasLocation } from "~/lib/locationUtils";

import { GridContext } from "./FilledCell";

export type GridItem = {
  key: string;
  location: CanvasLocation;
  render: (context: GridContext) => ReactElement;
};
