/// <reference path="../../../typings/tsd.d.ts" />

export interface GridLocation {
  row: number,
  column: number
}

export interface DMetric extends Metric{
  guesstimate: Guesstimate
}

export interface Metric {
  id: string,
  readableId: string,
  location: GridLocation
}
