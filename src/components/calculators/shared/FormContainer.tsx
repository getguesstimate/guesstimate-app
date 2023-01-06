import _ from "lodash";
import React, { Component } from "react";

import { CalculatorForm } from "./CalculatorForm";

import {
  INPUT,
  INTERMEDIATE,
  OUTPUT,
  relationshipType,
} from "~/lib/engine/graph";
import { Calculator } from "~/modules/calculators/reducer";
import { Optional } from "~/lib/engine/types";
import { ExtendedDSpace } from "~/components/spaces/denormalized-space-selector";
import { FullDenormalizedMetric } from "~/lib/engine/space";

function isCalculatorAcceptableMetric(metric) {
  return (
    !_.isEmpty(metric.name) && !_.isEmpty(_.get(metric, "guesstimate.input"))
  );
}

function addAtIndex(l: string[], e: string, destIndex: number) {
  const index = l.findIndex((el) => el === e);
  if (index >= destIndex) {
    return [
      ...l.slice(0, destIndex),
      e,
      ...l.slice(destIndex, index),
      ...l.slice(index + 1),
    ];
  } else {
    return [
      ...l.slice(0, index),
      ...l.slice(index + 1, destIndex + 1),
      e,
      ...l.slice(destIndex + 1),
    ];
  }
}

export type Props = {
  space: ExtendedDSpace;
  buttonText: string;
} & (
  | {
      mode: "edit";
      calculator: Calculator;
      onSubmit: (calculator: Calculator) => void;
    }
  | {
      mode: "new";
      // if calculator is unset then onSubmit doesn't have to receive full calculator object
      calculator?: undefined;
      onSubmit: (calculator: Optional<Calculator, "id">) => void;
    }
);

type State = {
  validInputs: FullDenormalizedMetric[];
  validOutputs: FullDenormalizedMetric[];
  calculator: Optional<Calculator, "id">;
};

export class FormContainer extends Component<Props, State> {
  state: State = {
    validInputs: [],
    validOutputs: [],
    calculator: {
      space_id: 0, // will be configured in setup()
      title: undefined,
      content: undefined,
      input_ids: [],
      output_ids: [],
    },
  };

  componentWillMount() {
    this.setup();
  }

  setup() {
    const { space } = this.props;
    if (!space.id) {
      return;
    }

    const { validInputs, validOutputs } = this.validMetrics(space.metrics);

    const calculator = this.props.calculator || {
      title: space.name || "",
      space_id: space.id,
      content: space.description || "",
      input_ids: validInputs.map((e) => e.id),
      output_ids: validOutputs.map((e) => e.id),
    };
    this.setState({ calculator, validInputs, validOutputs });
  }

  validMetrics(metrics: FullDenormalizedMetric[]) {
    const validMetrics = metrics.filter(isCalculatorAcceptableMetric);
    const validInputs = validMetrics.filter(
      (m) => relationshipType(m.edges) === INPUT
    );
    const validOutputs = validMetrics.filter((m) =>
      [INTERMEDIATE, OUTPUT].includes(relationshipType(m.edges))
    );
    return { validInputs, validOutputs };
  }

  _onCreate() {
    // this casting is a lie, necessary because it'd hard to sync props.mode and state.calculator
    this.props.onSubmit(this.state.calculator as Calculator);
  }

  _onMetricHide(id: string) {
    const { calculator } = this.state;
    this.setState({
      calculator: {
        ...calculator,
        input_ids: calculator.input_ids.filter((m) => m !== id),
        output_ids: calculator.output_ids.filter((m) => m !== id),
      },
    });
  }

  _onMetricShow(id: string) {
    const { calculator } = this.state;
    const { input_ids, output_ids } = calculator;

    let changes: {
      input_ids?: string[];
      output_ids?: string[];
    } = {};
    if (this._isInput(id)) {
      changes.input_ids = [...input_ids, id];
    } else {
      changes.output_ids = [...output_ids, id];
    }

    this.setState({ calculator: { ...calculator, ...changes } });
  }

  _isInput(id: string) {
    return _.some(this.state.validInputs, (e: any) => e.id === id);
  }

  _onMoveMetricTo(id: string, destIndex: number) {
    const {
      calculator: { input_ids, output_ids },
    } = this.state;
    const addId = (l: string[]) => addAtIndex(l, id, destIndex);
    this._changeCalculator(
      this._isInput(id)
        ? { input_ids: addId(input_ids) }
        : { output_ids: addId(output_ids) }
    );
  }

  _changeCalculator(fields: Partial<Calculator>) {
    const { calculator } = this.state;
    this.setState({
      calculator: {
        ...calculator,
        ...fields,
      },
    });
  }

  _isVisible(metricId: string) {
    const {
      calculator: { input_ids, output_ids },
    } = this.state;
    return _.some([...input_ids, ...output_ids], (e) => metricId === e);
  }

  _orderDisplayedMetrics(
    metric_ids: string[],
    validMetrics: FullDenormalizedMetric[]
  ) {
    return [
      ...metric_ids
        .map((i) => validMetrics.find((m) => m.id === i))
        .filter((m): m is NonNullable<typeof m> => !!m),
      ...validMetrics.filter((i) => !this._isVisible(i.id)),
    ].map((e) => {
      return { metric: e, isVisible: this._isVisible(e.id) };
    });
  }

  _onChangeName(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this._changeCalculator({ title: e.target.value });
  }

  _onChangeContent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this._changeCalculator({ content: e.target.value });
  }

  _isValid() {
    const {
      calculator: { title, input_ids, output_ids },
    } = this.state;
    return !(_.isEmpty(title) || _.isEmpty(input_ids) || _.isEmpty(output_ids));
  }

  render() {
    const {
      props: { buttonText },
      state: { validInputs, validOutputs, calculator },
    } = this;
    if (_.isEmpty(calculator)) {
      return false;
    }

    const inputs = this._orderDisplayedMetrics(
      calculator.input_ids,
      validInputs
    );
    const outputs = this._orderDisplayedMetrics(
      calculator.output_ids,
      validOutputs
    );

    return (
      <CalculatorForm
        calculator={calculator}
        inputs={inputs}
        outputs={outputs}
        onMetricHide={this._onMetricHide.bind(this)}
        onMetricShow={this._onMetricShow.bind(this)}
        onMoveMetricTo={this._onMoveMetricTo.bind(this)}
        onChangeName={this._onChangeName.bind(this)}
        onChangeContent={this._onChangeContent.bind(this)}
        onSubmit={this._onCreate.bind(this)}
        isValid={this._isValid()}
        buttonText={buttonText}
      />
    );
  }
}
