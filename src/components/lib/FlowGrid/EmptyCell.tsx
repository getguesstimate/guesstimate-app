import { CanvasLocation } from "~/lib/locationUtils";
import React, { Component } from "react";

type Props = {
  onAddItem(location: CanvasLocation): void;
  inSelectedCell: boolean;
  gridKeyPress(e: React.KeyboardEvent): void;
  location: CanvasLocation;
};

export class EmptyCell extends Component<Props> {
  shouldComponentUpdate() {
    return false; // TODO - is this safe?
  }

  render() {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && this.props.inSelectedCell) {
        this.props.onAddItem(this.props.location);
        e.preventDefault();
      }
      if (e.key === "Backspace") {
        e.preventDefault();
      }
    };

    return (
      <div
        className="FlowGridEmptyCell"
        onKeyPress={this.props.gridKeyPress}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      />
    );
  }
}
