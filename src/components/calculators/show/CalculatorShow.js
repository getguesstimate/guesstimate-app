import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import ReactMarkdown from "react-markdown";
import Icon from "gComponents/react-fa-patched";

import { Input } from "./input";
import { Output } from "./output";
import { Button } from "gComponents/utility/buttons/button.js";

import {
  deleteSimulations,
  runSimulations,
} from "gModules/simulations/actions";
import { changeGuesstimate } from "gModules/guesstimates/actions";

import * as _simulation from "gEngine/simulation";

import { Guesstimator } from "lib/guesstimator/index";

class UnconnectedCalculatorShow extends Component {
  state = {
    resultComputing: false,
    showResult: this.props.startFilled && this.allOutputsHaveStats(),
    hasSimulated: false,
    readyToCalculate: false,
  };

  componentWillReceiveProps(nextProps) {
    if (this.state.resultComputing && this.allOutputsHaveStats(nextProps)) {
      this.setState({ resultComputing: false });
      this.showResult();
    }
  }

  changeGuesstimate({ id, guesstimate }, input) {
    const parsed = Guesstimator.parse({ ...guesstimate, input });
    const guesstimateType = parsed[1].samplerType().referenceName;
    this.props.changeGuesstimate(
      id,
      { ...guesstimate, ...{ data: null, input, guesstimateType } },
      false // saveOnServer
    );
  }

  readyToSimulate(metric, input) {
    const [parseErrors] = Guesstimator.parse({ ...metric.guesstimate, input });
    return (
      !_.isEmpty(input) &&
      _.isEmpty(parseErrors) &&
      this.allInputsHaveContent([metric.id])
    );
  }

  onBlur(metric, input) {
    // We only want to simulate anything if all the inputs have simulatable content.
    if (!this.state.hasSimulated && this.readyToSimulate(metric, input)) {
      _.defer(() => {
        this.props.inputs.forEach((i) =>
          this.changeGuesstimate(
            i,
            i.id === metric.id ? input : this.getInputContent(i)
          )
        );
        this.props.deleteSimulations([
          ...this.props.inputs.map((i) => i.id),
          ...this.props.outputs.map((o) => o.id),
        ]);
        this.props.runSimulations({
          spaceId: this.props.calculator.space_id,
          simulateSubsetFrom: this.props.inputs.map((i) => i.id),
        });
      });
      this.setState({ hasSimulated: true, resultComputing: true });
    }
  }

  onChange(metric, input) {
    if (this.readyToSimulate(metric, input)) {
      if (this.state.hasSimulated) {
        this.changeGuesstimate(metric, input);
        this.props.runSimulations({
          spaceId: this.props.calculator.space_id,
          simulateSubsetFrom: [metric.id],
        });
      }
      if (!this.state.readyToCalculate) {
        this.setState({ readyToCalculate: true });
      }
    } else {
      if (this.state.readyToCalculate) {
        this.setState({ readyToCalculate: false });
      }
    }
  }

  onEnter(id) {
    this.refs[`input-${id}`].blur();
    if (!this.state.readyToCalculate) {
      return;
    }
    if (this.allOutputsHaveStats() && this.state.hasSimulated) {
      this.showResult();
    } else {
      if (!this.state.resultComputing) {
        this.setState({ resultComputing: true });
      }
    }
  }

  getInputContent({ id }) {
    return this.refs[`input-${id}`].getContent();
  }

  allInputsHaveContent(idsToExclude = []) {
    const includedInputs = this.props.inputs.filter(
      (i) => !_.some(idsToExclude, (id) => i.id === id)
    );
    const inputComponents = _.map(
      includedInputs,
      (metric) => this.refs[`input-${metric.id}`]
    );
    return _.every(inputComponents, (i) => !!i && i.hasValidContent());
  }

  allOutputsHaveStats({ outputs } = this.props) {
    return outputs
      .map((o) => !!o && _.has(o, "simulation.stats"))
      .reduce((x, y) => x && y, true);
  }

  showResult() {
    if (_.has(this, "props.onShowResult")) {
      this.props.onShowResult();
    }
    if (!this.state.showResult) {
      this.setState({ showResult: true });
    }
  }

  render() {
    const {
      calculator: { content, title, space_id, share_image },
      startFilled,
      size,
      inputs,
      outputs,
      isPrivate,
      classes,
    } = this.props;

    return (
      <div className={`${["calculator", ...classes].join(" ")}`}>
        <div className="padded-section">
          <div className="title-bar">
            <div className="row">
              <div className="col-xs-10">
                <h1>{title}</h1>
                {isPrivate && (
                  <span className="privacy-icon">
                    <Icon name="lock" />
                    Private
                  </span>
                )}
              </div>
              {size === "wide" && (
                <div className="col-xs-2 action-section">
                  <Button onClick={this.props.showHelp}>
                    <Icon name="question" />
                    Help
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="description">
            <ReactMarkdown source={content} />
          </div>
          <div className="inputs">
            {_.map(inputs, (metric, i) => (
              <Input
                ref={`input-${metric.id}`}
                key={metric.id}
                id={metric.id}
                isFirst={i === 0}
                name={metric.name}
                description={_.get(metric, "guesstimate.description")}
                errors={_simulation.errors(metric.simulation)}
                onBlur={this.onBlur.bind(this, metric)}
                onChange={this.onChange.bind(this, metric)}
                onEnter={this.onEnter.bind(this)}
                initialValue={
                  (startFilled && _.get(metric, "guesstimate.input")) || ""
                }
              />
            ))}
          </div>
          {this.state.showResult && (
            <div>
              <hr className="result-divider" />
              <div className="outputs">
                {_.map(outputs, (m) => (
                  <Output key={m.id} metric={m} />
                ))}
              </div>
            </div>
          )}
          {!this.state.showResult && (
            <div className="row">
              <div className="col-xs-12 col-md-7" />
              <div className="col-xs-12 col-md-5">
                <div
                  className={`ui button calculateButton${
                    this.state.resultComputing
                      ? " loading"
                      : this.state.readyToCalculate
                      ? ""
                      : " disabled"
                  }`}
                  onClick={() => {
                    this.allOutputsHaveStats()
                      ? this.showResult()
                      : this.setState({ resultComputing: true });
                  }}
                >
                  Calculate
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export const CalculatorShow = connect(null, (dispatch) =>
  bindActionCreators(
    { changeGuesstimate, deleteSimulations, runSimulations },
    dispatch
  )
)(UnconnectedCalculatorShow);
