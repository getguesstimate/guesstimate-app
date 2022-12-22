import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Main extends Component {
  static defaultProps = {
    isFluid: false,
    backgroundColor: "",
  };

  static propTypes = {
    isFluid: PropTypes.bool,
    backgroundColor: PropTypes.oneOf(["", "BLUE", "GREY"]),
  };

  render() {
    const { children, isFluid, backgroundColor } = this.props;
    let className = "";
    className += backgroundColor === "BLUE" ? " blue" : "";
    className += backgroundColor === "GREY" ? " grey" : "";
    className += isFluid ? " fluid" : "";

    if (isFluid) {
      return <main className={className}>{children}</main>;
    } else {
      return (
        <main className={className}>
          <div className="wrap">{children}</div>
        </main>
      );
    }
  }
}
