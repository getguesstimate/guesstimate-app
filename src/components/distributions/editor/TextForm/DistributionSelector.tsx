import React, { Component } from "react";

import ReactTooltip from "react-tooltip";

import { Guesstimator } from "~/lib/guesstimator/index";

import { getClassName } from "~/lib/engine/utils";

import * as elev from "~/server/elev/index";

type DistributionType = "LOGNORMAL" | "NORMAL" | "UNIFORM";

// We use onMouseUp to make sure that the onMouseUp
// does not get called once another metric is underneath

const ReactTooltipParams = {
  class: "header-action-tooltip",
  delayShow: 0,
  delayHide: 0,
  place: "top",
  effect: "solid",
};

const Descriptions: { [k in DistributionType]: { name: string } } = {
  LOGNORMAL: {
    name: "Lognormal",
  },
  NORMAL: {
    name: "Normal",
  },
  UNIFORM: {
    name: "Uniform",
  },
};

const DistributionIcon: React.FC<{
  isSelected: boolean;
  isDisabled: boolean;
  type: DistributionType;
  icon?: string;
  onSubmit(type: DistributionType): void;
}> = ({ isSelected, isDisabled, type, icon, onSubmit }) => (
  <div
    className={getClassName(
      "ui",
      "button",
      "tinyhover-toggle",
      "DistributionIcon",
      isSelected ? "selected" : null,
      isDisabled ? "disabled" : null
    )}
    onClick={() => onSubmit(type)}
    data-tip
    data-for={type}
  >
    <ReactTooltip {...ReactTooltipParams} id={type}>
      {" "}
      {Descriptions[type].name}{" "}
    </ReactTooltip>
    {icon ? <img src={icon} /> : undefined}
  </div>
);

export class DistributionSelector extends Component<{
  disabledTypes: DistributionType[];
  selected: string;
  onSubmit(type: DistributionType): void;
}> {
  static defaultProps = {
    disabledTypes: [],
  };

  _handleShowMore() {
    elev.open(elev.ADDITIONAL_DISTRIBUTIONS);
  }

  render() {
    const { selected, disabledTypes } = this.props;

    const allTypes: DistributionType[] = ["LOGNORMAL", "NORMAL", "UNIFORM"];
    return (
      <div className="DistributionSelector">
        <hr />
        <a
          className="more-distributions"
          onClick={this._handleShowMore.bind(this)}
        >
          More
        </a>
        <div className="DistributionList">
          {allTypes.map((type) => (
            <DistributionIcon
              type={type}
              onSubmit={this.props.onSubmit}
              isSelected={selected === type}
              isDisabled={disabledTypes.includes(type)}
              icon={Guesstimator.samplerTypes.find(type).icon}
              key={type}
            />
          ))}
        </div>
      </div>
    );
  }
}
