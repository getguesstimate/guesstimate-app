import _ from "lodash";
import { NextRouter, withRouter } from "next/router";
import { Component } from "react";

import {
  Fact,
  hasRequiredProperties,
  isExportedFromSpace,
  simulateFact,
} from "gEngine/facts";
import { FactCategory } from "gEngine/fact_category";
import { addStats, hasErrors } from "gEngine/simulation";
import { spaceUrlById } from "gEngine/space";
import { orStr } from "gEngine/utils";

import { withVariableName } from "lib/generateVariableNames/generateFactVariableName";
import { formatData, isData } from "lib/guesstimator/formatter/formatters/Data";

type Props = {
  categories: FactCategory[];
  existingVariableNames: string[];
  onSubmit(fact: Fact): void;
  onCancel(): void;
  onDelete?(): void;
  startingFact?: Fact;
  categoryId?: string | null;
  buttonText: string;
} & { router: NextRouter };

type State = {
  runningFact: Fact;
  variableNameManuallySet: boolean;
  currentExpressionSimulated: boolean;
  submissionPendingOnSimulation: boolean;
};

class FactForm_ extends Component<Props, State> {
  static defaultProps = {
    startingFact: {
      id: "0",
      name: "",
      expression: "",
      variable_name: "",
      exported_from_id: null,
      metric_id: null,
      category_id: null,
      simulation: {
        sample: {
          values: [],
          errors: [],
        },
        stats: {},
      },
    },
    categories: [],
  };

  state: State = {
    runningFact: {
      ...this.props.startingFact!,
      category_id:
        _.get(this, "props.startingFact.category_id") || this.props.categoryId,
    },
    variableNameManuallySet: !_.isEmpty(
      _.get(this.props, "startingFact.variable_name")
    ),
    currentExpressionSimulated: true,
    submissionPendingOnSimulation: false,
  };

  componentDidUpdate(_, prevState) {
    if (
      this.state.currentExpressionSimulated &&
      prevState.submissionPendingOnSimulation
    ) {
      this.onSubmit();
    }
  }

  componentDidMount() {
    (this.refs.name as any).focus();
  }

  setFactState(newFactState, otherState = {}) {
    this.setState({
      ...otherState,
      runningFact: { ...this.state.runningFact, ...newFactState },
    });
  }
  onChangeName(e) {
    const name = _.get(e, "target.value");
    this.setFactState(
      this.state.variableNameManuallySet
        ? { name }
        : withVariableName(
            { ...this.state.runningFact, name },
            this.props.existingVariableNames
          )
    );
  }
  onSelectCategory(c) {
    this.setFactState({ category_id: c.target.value });
  }
  onChangeVariableName(e) {
    this.setFactState(
      { variable_name: _.get(e, "target.value") },
      { variableNameManuallySet: true }
    );
  }
  onChangeExpression(e) {
    this.setFactState(
      { expression: _.get(e, "target.value") },
      { currentExpressionSimulated: false }
    );
  }
  onBlurExpression() {
    this.simulateCurrentExpression();
  }
  simulateCurrentExpression() {
    const { runningFact } = this.state;
    if (isData(runningFact.expression)) {
      let simulation = {
        sample: { values: formatData(runningFact.expression) },
      };
      addStats(simulation);
      this.setFactState({ simulation }, { currentExpressionSimulated: true });
    } else {
      simulateFact(this.state.runningFact).then((sample) => {
        let simulation = { sample };
        addStats(simulation);
        this.setFactState({ simulation }, { currentExpressionSimulated: true });
      });
    }
  }

  hasNoErrors() {
    return !hasErrors(this.state.runningFact.simulation);
  }
  isVariableNameUnique() {
    return !_.some(
      this.props.existingVariableNames,
      (n) => n === this.state.runningFact.variable_name
    );
  }
  isValid() {
    return (
      hasRequiredProperties(this.state.runningFact) &&
      this.hasNoErrors() &&
      this.isVariableNameUnique()
    );
  }

  onSubmit() {
    if (this.state.currentExpressionSimulated) {
      this.props.onSubmit(this.state.runningFact);
    } else {
      this.setState({ submissionPendingOnSimulation: true });
    }
  }

  submitIfEnter(e) {
    if (e.keyCode === 13 && this.isValid()) {
      this.onSubmit();
    }
  }

  renderEditExpressionSection() {
    if (isExportedFromSpace(this.state.runningFact)) {
      const exported_from_url = `${spaceUrlById(
        _.get(this, "state.runningFact.exported_from_id")
      )}?factsShown=true`;
      return (
        <span
          className="ui button small options"
          onClick={() => this.props.router.push(exported_from_url)}
        >
          Edit Model
        </span>
      );
    } else {
      return (
        <div className={`field ${this.hasNoErrors() ? "" : "error"}`}>
          <input
            type="text"
            placeholder="value"
            value={this.state.runningFact.expression}
            onChange={this.onChangeExpression.bind(this)}
            onBlur={this.onBlurExpression.bind(this)}
            onKeyDown={this.submitIfEnter.bind(this)}
          />
        </div>
      );
    }
  }

  render() {
    const {
      props: { buttonText, onCancel, onDelete, categories },
      state: {
        submissionPendingOnSimulation,
        runningFact: { expression, name, variable_name, category_id },
      },
    } = this;

    let buttonClasses = ["ui", "button", "small", "primary"];
    if (submissionPendingOnSimulation) {
      buttonClasses.push("disabled", "loading");
    } else if (!this.isValid()) {
      buttonClasses.push("disabled");
    }

    return (
      <div className="Fact--outer">
        <div className="Fact new ui form">
          <div className="section-simulation simulation-sample">
            {this.renderEditExpressionSection()}
          </div>
          <div className="section-name">
            <div className="fact-name">
              <div
                className={`field ${
                  this.isVariableNameUnique() ? "" : "error"
                }`}
              >
                <textarea
                  rows={1}
                  placeholder="name"
                  value={name}
                  onChange={this.onChangeName.bind(this)}
                  onKeyDown={this.submitIfEnter.bind(this)}
                  ref="name"
                />
              </div>
            </div>
            <div className="variable-name">
              <div className="field">
                <span className="prefix">#</span>
                <input
                  type="text"
                  placeholder="hashtag"
                  value={variable_name}
                  onChange={this.onChangeVariableName.bind(this)}
                  onKeyDown={this.submitIfEnter.bind(this)}
                />
              </div>
            </div>
            {!_.isEmpty(categories) && (
              <div className="field">
                <div className="category-select">
                  <select
                    value={`${orStr(category_id)}`}
                    onChange={this.onSelectCategory.bind(this)}
                  >
                    <option value={""}>Uncategorized</option>
                    {_.map(categories, ({ id, name }) => (
                      <option value={id} key={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            <div className="actions">
              <span
                className={buttonClasses.join(" ")}
                onClick={this.onSubmit.bind(this)}
              >
                {buttonText}
              </span>
              {!!onCancel && (
                <span className="ui button small" onClick={onCancel}>
                  Cancel
                </span>
              )}
              {!!onDelete && (
                <span className="ui button small" onClick={onDelete}>
                  Delete
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const FactForm = withRouter(FactForm_);
