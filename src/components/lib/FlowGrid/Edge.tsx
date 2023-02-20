import _ from "lodash";
import React from "react";

import angleBetweenPoints from "angle-between-points";

import { edgeColors, PathStatus } from "./Edges";
import { RectangleShape } from "./gridPoints";

class Rectangle {
  left: number;
  right: number;
  top: number;
  bottom: number;

  constructor(locations: RectangleShape) {
    this.left = locations.left;
    this.right = locations.right;
    this.top = locations.top;
    this.bottom = locations.bottom;
  }

  _xMiddle() {
    return this.left + (this.right - this.left) / 2;
  }
  _yMiddle() {
    return this.top + (this.bottom - this.top) / 2;
  }

  topPoint(adjust: number) {
    return { x: this._xMiddle() + adjust, y: this.top };
  }
  bottomPoint(adjust: number) {
    return { x: this._xMiddle() + adjust, y: this.bottom };
  }
  leftPoint(adjust: number) {
    return { x: this.left, y: this._yMiddle() + adjust };
  }
  rightPoint(adjust: number) {
    return { x: this.right, y: this._yMiddle() + adjust };
  }

  angleTo(otherRectangle: RectangleShape) {
    const other = new Rectangle(otherRectangle);
    const points = [
      { x: this._xMiddle(), y: -1 * this._yMiddle() },
      { x: other._xMiddle(), y: -1 * other._yMiddle() },
    ];
    return angleBetweenPoints(...points);
  }

  positionFrom(otherRectangle: RectangleShape) {
    const angle = this.angleTo(otherRectangle);

    const RECTANGLE_ANGLE = 30;
    // this is 45 for a perfect square
    //
    if (angle < RECTANGLE_ANGLE) {
      return "ON_RIGHT";
    } else if (angle < 180 - RECTANGLE_ANGLE) {
      return "ON_TOP";
    } else if (angle < 180 + RECTANGLE_ANGLE) {
      return "ON_LEFT";
    } else if (angle < 360 - RECTANGLE_ANGLE) {
      return "ON_BOTTOM";
    } else {
      return "ON_RIGHT";
    }
  }

  adjustment(otherRectangle: RectangleShape) {
    return this.shouldAdjust(otherRectangle)
      ? this.adjustmentAmount(otherRectangle)
      : 0;
  }

  shouldAdjust(otherRectangle: RectangleShape) {
    const angle = this.angleTo(otherRectangle);
    return angle % 90 < 4;
  }

  //this randomness really messes up with rendering, will stop for now
  adjustmentAmount(otherRectangle: RectangleShape) {
    const ADJUSTMENT_RANGE = 20;
    return Math.random() * ADJUSTMENT_RANGE - ADJUSTMENT_RANGE / 2;
  }

  showPosition(otherRectangle: RectangleShape) {
    const positionFrom = this.positionFrom(otherRectangle);
    const adjust = 0;
    switch (positionFrom) {
      case "ON_LEFT":
        return this.leftPoint(adjust);
      case "ON_RIGHT":
        return this.rightPoint(adjust);
      case "ON_TOP":
        return this.topPoint(adjust);
      case "ON_BOTTOM":
        return this.bottomPoint(adjust);
    }
  }
}

const isValidNode = ({ top, left, right, bottom }: RectangleShape) => {
  return _.every([top, left, right, bottom], _.isFinite);
};

type Props = {
  input: RectangleShape;
  output: RectangleShape;
  hasErrors?: boolean;
  pathStatus: PathStatus;
};

export const Edge: React.FC<Props> = React.memo(
  ({ output, input, hasErrors, pathStatus }) => {
    if (!isValidNode(input) || !isValidNode(output)) {
      return null;
    }

    const inputPoints = new Rectangle(input).showPosition(output);
    const outputPoints = new Rectangle(output).showPosition(input);

    const points = `M${inputPoints.x},${inputPoints.y} L${outputPoints.x} ,${outputPoints.y}`;

    return (
      <path
        stroke={edgeColors[hasErrors ? "hasErrors" : pathStatus]}
        strokeWidth={3}
        d={points}
        markerEnd={`url(#MarkerArrow-${hasErrors ? "hasErrors" : pathStatus})`}
        fill="none"
      />
    );
  },
  (props, nextProps) => _.isEqual(props, nextProps)
);
