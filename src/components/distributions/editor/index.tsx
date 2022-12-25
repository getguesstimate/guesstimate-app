import React, { Component } from "react";
import { connect } from "react-redux";

import { DataForm } from "./DataForm/DataForm";
import { TextForm } from "./TextForm/TextForm";

import { changeMetricClickMode } from "gModules/canvas_state/actions";
import { changeGuesstimate } from "gModules/guesstimates/actions";
import { runFormSimulations } from "gModules/simulations/actions";

import { AppDispatch } from "gModules/store";
import { Guesstimator } from "lib/guesstimator/index";

type Props = {
  metricClickMode: string;
  guesstimate: any;
  metricId: string;
  onReturn: () => void;
  onTab: () => void;
  jumpSection: () => void;
  canUseOrganizationFacts: boolean;
  organizationId?: string;
  size: string;
  onOpen: () => void;
  inputMetrics: any;
} & { dispatch: AppDispatch };

export class UnwrappedDistributionEditor extends Component<Props> {
  formRef: React.RefObject<TextForm>;

  constructor(props: Props) {
    super(props);
    this.formRef = React.createRef();
  }

  componentDidUpdate(prevProps: Props) {
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
    this.formRef.current?.focus();
  }

  _guesstimateType(changes) {
    return Guesstimator.parse({
      ...this.props.guesstimate,
      ...changes,
    })[1].samplerType().referenceName;
  }

  changeGuesstimate(changes, runFormSims, saveToServer) {
    this.props.dispatch(
      changeGuesstimate(
        this.props.metricId,
        { ...this.props.guesstimate, ...changes },
        saveToServer
      )
    );
    if (runFormSims) {
      this.props.dispatch(runFormSimulations(this.props.metricId));
    }
  }

  changeInput(input) {
    const guesstimateType = this._guesstimateType({ input });
    this.changeGuesstimate({ data: null, input, guesstimateType }, true, false);
    if (guesstimateType === "FUNCTION") {
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
      this.props.dispatch(changeMetricClickMode(newMode));
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
            ref={this.formRef}
          />
        )}
      </div>
    );
  }
}

export default connect(null, null, null, { forwardRef: true })(
  UnwrappedDistributionEditor
);
