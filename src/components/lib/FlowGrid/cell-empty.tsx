import { CanvasLocation } from "~/lib/locationUtils";
import React, { Component } from "react";

type Props = {
  onAddItem(location: CanvasLocation): void;
  inSelectedCell: boolean;
  gridKeyPress(e: React.KeyboardEvent): void;
  location: CanvasLocation;
};

export default class EmptyCell extends Component<Props> {
  shouldComponentUpdate() {
    return false;
  }

  _handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && this.props.inSelectedCell) {
      this.props.onAddItem(this.props.location);
      e.preventDefault();
    }
    if (e.key === "Backspace") {
      e.preventDefault();
    }
  }

  render() {
    return (
      <div
        className="FlowGridEmptyCell"
        onKeyPress={this.props.gridKeyPress}
        onKeyDown={this._handleKeyDown.bind(this)}
        tabIndex={0}
      />
    );
  }
}
