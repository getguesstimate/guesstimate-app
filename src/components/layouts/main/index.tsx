import React, { Component } from "react";

type Props = {
  isFluid?: boolean;
  backgroundColor?: "BLUE" | "GREY";
  children: React.ReactNode;
};

export default class Main extends Component<Props> {
  static defaultProps = {
    isFluid: false,
    backgroundColor: "",
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
