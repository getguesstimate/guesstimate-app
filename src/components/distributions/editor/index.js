import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { DataForm } from "./DataForm/DataForm";
import { TextForm } from "./TextForm/TextForm";

import { changeMetricClickMode } from "gModules/canvas_state/actions";
import { changeGuesstimate } from "gModules/guesstimates/actions";
import { runFormSimulations } from "gModules/simulations/actions";

import { Guesstimator } from "lib/guesstimator/index";

import "./style.css";

@connect(
  null,
  (dispatch) =>
    bindActionCreators(
      { changeGuesstimate, runFormSimulations, changeMetricClickMode },
      dispatch
    ),
  null,
  { withRef: true }
)
export default class Guesstimate extends Component {
  static propTypes = {
    changeGuesstimate: PropTypes.func.isRequired,
    runFormSimulations: PropTypes.func.isRequired,
    changeMetricClickMode: PropTypes.func.isRequired,
    metricClickMode: PropTypes.string,
    guesstimate: PropTypes.object,
    metricId: PropTypes.string.isRequired,
    size: PropTypes.string,
    onOpen: PropTypes.func,
  };

  componentDidUpdate(prevProps) {
    const {
      guesstimate: { input, guesstimateType },
    } = this.props;
    const sameInput = input === prevProps.guesstimate.input;
    if (
      !sameInput &&
      prevProps.guesstimate.guesstimateType === "FUNCTION" &&
      guesstimateType !== "FUNCTION"
    ) {
      this._changeMetricClickMode();
    }
  }

  focus() {
    this.refs.TextForm.focus();
  }

  _guesstimateType(changes) {
    return Guesstimator.parse({
      ...this.props.guesstimate,
      ...changes,
    })[1].samplerType().referenceName;
  }

  changeGuesstimate(changes, runFormSims, saveToServer) {
    this.props.changeGuesstimate(
      this.props.metricId,
      { ...this.props.guesstimate, ...changes },
      saveToServer
    );
    if (runFormSims) {
      this.props.runFormSimulations(this.props.metricId);
    }
  }

  changeInput(input) {
    const guesstimateType = this._guesstimateType({ input });
    this.changeGuesstimate({ data: null, input, guesstimateType }, true, false);
    if (
      guesstimateType === "FUNCTION" &&
      this.props.guesstimateType !== "FUNCTION"
    ) {
      this._changeMetricClickMode("FUNCTION_INPUT_SELECT");
    }
  }
  changeGuesstimateTypeAndSave(guesstimateType) {
    this.changeGuesstimate({ guesstimateType }, true, true);
  }
  addDataAndSave(data) {
    this.changeGuesstimate(
      { guesstimateType: "DATA", data, input: null },
      true,
      true
    );
  }
  saveToServer() {
    this.changeGuesstimate({}, false, true);
  }

  // TODO(matthew): no magic strings.
  _changeMetricClickMode(newMode = "DEFAULT") {
    if (this.props.metricClickMode !== newMode) {
      this.props.changeMetricClickMode(newMode);
    }
  }

  handleReturn(shifted) {
    if (shifted) {
      this.props.jumpSection();
    } else {
      this.props.onReturn();
    }
    return true;
  }

  handleTab(shifted) {
    if (shifted) {
      this.props.jumpSection();
    } else {
      this.props.onTab();
    }
    return true;
  }

  render() {
    const {
      size,
      guesstimate,
      inputMetrics,
      onOpen,
      organizationId,
      canUseOrganizationFacts,
    } = this.props;
    if (guesstimate.metric !== this.props.metricId) {
      return false;
    }

    const hasData = !!guesstimate.data;
    const formClasses = `Guesstimate${size === "large" ? " large" : ""}`;

    return (
      <div className={formClasses}>
        {hasData && (
          <DataForm
            data={guesstimate.data}
            size={size}
            onSave={this.addDataAndSave.bind(this)}
            onOpen={onOpen}
          />
        )}
        {!hasData && (
          <TextForm
            guesstimate={guesstimate}
            inputMetrics={inputMetrics}
            onAddData={this.addDataAndSave.bind(this)}
            onChangeInput={this.changeInput.bind(this)}
            onChangeGuesstimateType={this.changeGuesstimateTypeAndSave.bind(
              this
            )}
            onSave={this.saveToServer.bind(this)}
            onChangeClickMode={this._changeMetricClickMode.bind(this)}
            onAddDefaultData={() => {
              this.addDataAndSave([1, 2, 3]);
            }}
            onReturn={this.handleReturn.bind(this)}
            onTab={this.handleTab.bind(this)}
            size={size}
            organizationId={organizationId}
            canUseOrganizationFacts={canUseOrganizationFacts}
            ref="TextForm"
          />
        )}
      </div>
    );
  }
}
