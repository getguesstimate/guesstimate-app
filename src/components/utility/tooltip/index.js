import React, { Component } from "react";

import "./style.css";

export default class ToolTip extends Component {
  render() {
    return (
      <div className={`ToolTip ${this.props.size || "SMALL"}`}>
        <div className="arrow-up" />
        {this.props.children}
      </div>
    );
  }
}
