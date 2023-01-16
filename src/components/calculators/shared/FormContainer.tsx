import _ from "lodash";
import React, { useState } from "react";

import { CalculatorForm } from "./CalculatorForm";

import { ExtendedDSpace } from "~/components/spaces/denormalized-space-selector";
import {
  INPUT,
  INTERMEDIATE,
  OUTPUT,
  relationshipType,
} from "~/lib/engine/graph";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { Optional } from "~/lib/engine/types";
import { Calculator } from "~/modules/calculators/reducer";

function isCalculatorAcceptableMetric(metric: FullDenormalizedMetric) {
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

export const FormContainer: React.FC<Props> = (props) => {
  const [state, setState] = useState<State>(() => {
    const { space } = props;
    if (!space.id) {
      return {
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
    }

    const validMetrics = space.metrics.filter(isCalculatorAcceptableMetric);
    const validInputs = validMetrics.filter(
      (m) => relationshipType(m.edges) === INPUT
    );
    const validOutputs = validMetrics.filter((m) =>
      [INTERMEDIATE, OUTPUT].includes(relationshipType(m.edges))
    );

    const calculator = props.calculator || {
      title: space.name || "",
      space_id: space.id,
      content: space.description || "",
      input_ids: validInputs.map((e) => e.id),
      output_ids: validOutputs.map((e) => e.id),
    };

    return { calculator, validInputs, validOutputs };
  });

  const _isVisible = (metricId: string) => {
    return _.some(
      [...state.calculator.input_ids, ...state.calculator.output_ids],
      (e) => metricId === e
    );
  };

  const changeCalculator = (fields: Partial<Calculator>) => {
    const { calculator } = state;
    setState({
      ...state,
      calculator: {
        ...calculator,
        ...fields,
      },
    });
  };

  const orderDisplayedMetrics = (
    metric_ids: string[],
    validMetrics: FullDenormalizedMetric[]
  ) => {
    return [
      ...metric_ids
        .map((i) => validMetrics.find((m) => m.id === i))
        .filter((m): m is NonNullable<typeof m> => !!m),
      ...validMetrics.filter((i) => !_isVisible(i.id)),
    ].map((e) => {
      return { metric: e, isVisible: _isVisible(e.id) };
    });
  };

  const isValid = !(
    _.isEmpty(state.calculator.title) ||
    _.isEmpty(state.calculator.input_ids) ||
    _.isEmpty(state.calculator.output_ids)
  );

  const isInput = (id: string) => {
    return _.some(state.validInputs, (e) => e.id === id);
  };

  const handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    changeCalculator({ content: e.target.value });
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    changeCalculator({ title: e.target.value });
  };

  const handleMoveMetricTo = (id: string, destIndex: number) => {
    const addId = (l: string[]) => addAtIndex(l, id, destIndex);
    changeCalculator(
      isInput(id)
        ? { input_ids: addId(state.calculator.input_ids) }
        : { output_ids: addId(state.calculator.output_ids) }
    );
  };

  const handleMetricHide = (id: string) => {
    const { calculator } = state;
    setState({
      ...state,
      calculator: {
        ...calculator,
        input_ids: calculator.input_ids.filter((m) => m !== id),
        output_ids: calculator.output_ids.filter((m) => m !== id),
      },
    });
  };

  const handleMetricShow = (id: string) => {
    const { calculator } = state;

    let changes: {
      input_ids?: string[];
      output_ids?: string[];
    } = {};
    if (isInput(id)) {
      changes.input_ids = [...calculator.input_ids, id];
    } else {
      changes.output_ids = [...calculator.output_ids, id];
    }

    setState({ ...state, calculator: { ...calculator, ...changes } });
  };

  const handleCreate = () => {
    // this casting is a lie, necessary because it'd hard to sync props.mode and state.calculator
    props.onSubmit(state.calculator as Calculator);
  };

  const inputs = orderDisplayedMetrics(
    state.calculator.input_ids,
    state.validInputs
  );
  const outputs = orderDisplayedMetrics(
    state.calculator.output_ids,
    state.validOutputs
  );

  return (
    <CalculatorForm
      calculator={state.calculator}
      inputs={inputs}
      outputs={outputs}
      onMetricHide={handleMetricHide}
      onMetricShow={handleMetricShow}
      onMoveMetricTo={handleMoveMetricTo}
      onChangeName={handleChangeName}
      onChangeContent={handleChangeContent}
      onSubmit={handleCreate}
      isValid={isValid}
      buttonText={props.buttonText}
    />
  );
};
