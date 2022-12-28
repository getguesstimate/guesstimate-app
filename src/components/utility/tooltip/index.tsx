import React, { Component } from "react";

export default class ToolTip extends Component<any> {
  render() {
    return (
      <div className={`ToolTip ${this.props.size || "SMALL"}`}>
        <div className="arrow-up" />
        {this.props.children}
      </div>
    );
  }
}
