import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";

import ReactMarkdown from "react-markdown";
import Icon from "~/components/react-fa-patched";

import { ButtonWithIcon } from "~/components/utility/buttons/button";
import { Input, InputHandle } from "./input";
import { Output } from "./output";

import { changeGuesstimate } from "~/modules/guesstimates/actions";
import {
  deleteSimulations,
  runSimulations,
} from "~/modules/simulations/actions";

import * as _simulation from "~/lib/engine/simulation";

import clsx from "clsx";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import { Optional } from "~/lib/engine/types";
import { Guesstimator } from "~/lib/guesstimator/index";
import { Calculator } from "~/modules/calculators/reducer";
import { useAppDispatch } from "~/modules/hooks";

type Props = {
  calculator: Optional<Calculator, "id">;
  startFilled?: boolean;
  size?: string;
  inputs: FullDenormalizedMetric[];
  outputs: FullDenormalizedMetric[];
  isPrivate?: boolean;
  showHelp?(): void;
  onShowResult?(): void;
  classes: string[];
};

export const CalculatorShow: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();

  const [state, setState] = useState(() => ({
    resultComputing: false,
    showResult: props.startFilled && allOutputsHaveStats(),
    hasSimulated: false,
    readyToCalculate: false,
  }));

  const inputRefs = useRef<Map<string, InputHandle | null>>(
    new Map<string, InputHandle>()
  );

  // previously: componentWillReceiveProps
  useEffect(() => {
    if (state.resultComputing && allOutputsHaveStats(props)) {
      setState({ ...state, resultComputing: false });
      showResult();
    }
  });

  const allInputsHaveContent = (idsToExclude: string[] = []) => {
    const includedInputs = props.inputs.filter(
      (i) => !_.some(idsToExclude, (id) => i.id === id)
    );
    const inputComponents = includedInputs.map((metric) =>
      inputRefs.current.get(metric.id)
    );
    return _.every(inputComponents, (i) => !!i && i.hasValidContent);
  };

  const doChangeGuesstimate = (
    { id, guesstimate }: FullDenormalizedMetric,
    input
  ) => {
    const parsed = Guesstimator.parse({ ...guesstimate, input });
    const guesstimateType = parsed[1].samplerType().referenceName;
    dispatch(
      changeGuesstimate(
        id,
        { ...guesstimate, ...{ data: null, input, guesstimateType } },
        false // saveOnServer
      )
    );
  };

  const readyToSimulate = (metric: FullDenormalizedMetric, input) => {
    const [parseErrors] = Guesstimator.parse({
      ...metric.guesstimate,
      input,
    });
    return (
      !_.isEmpty(input) &&
      _.isEmpty(parseErrors) &&
      allInputsHaveContent([metric.id])
    );
  };

  const handleBlur = (metric: FullDenormalizedMetric, input) => {
    // We only want to simulate anything if all the inputs have simulatable content.
    if (!state.hasSimulated && readyToSimulate(metric, input)) {
      _.defer(() => {
        props.inputs.forEach((i) =>
          doChangeGuesstimate(
            i,
            i.id === metric.id ? input : getInputContent(i)
          )
        );
        dispatch(
          deleteSimulations([
            ...props.inputs.map((i) => i.id),
            ...props.outputs.map((o) => o.id),
          ])
        );
        dispatch(
          runSimulations({
            spaceId: props.calculator.space_id,
            simulateSubsetFrom: props.inputs.map((i) => i.id),
          })
        );
      });
      setState({ ...state, hasSimulated: true, resultComputing: true });
    }
  };

  const handleChange = (metric: FullDenormalizedMetric, input) => {
    if (readyToSimulate(metric, input)) {
      if (state.hasSimulated) {
        doChangeGuesstimate(metric, input);
        dispatch(
          runSimulations({
            spaceId: props.calculator.space_id,
            simulateSubsetFrom: [metric.id],
          })
        );
      }
      if (!state.readyToCalculate) {
        setState({ ...state, readyToCalculate: true });
      }
    } else {
      if (state.readyToCalculate) {
        setState({ ...state, readyToCalculate: false });
      }
    }
  };

  const handleEnter = (id: string) => {
    inputRefs.current.get(id)?.blur();
    if (!state.readyToCalculate) {
      return;
    }
    if (allOutputsHaveStats() && state.hasSimulated) {
      showResult();
    } else {
      if (!state.resultComputing) {
        setState({ ...state, resultComputing: true });
      }
    }
  };

  const getInputContent = ({ id }) => {
    return inputRefs.current.get(id)?.getContent();
  };

  const allOutputsHaveStats = ({ outputs } = props) => {
    return outputs
      .map((o) => !!o && _.has(o, "simulation.stats"))
      .reduce((x, y) => x && y, true);
  };

  const showResult = () => {
    props.onShowResult?.();
    if (!state.showResult) {
      setState({ ...state, showResult: true });
    }
  };

  return (
    <div className={clsx("calculator", ...props.classes)}>
      <div className="flex justify-between">
        <div className="flex items-end">
          <h1 className="leading-none m-0">{props.calculator.title}</h1>
          {props.isPrivate && (
            <div className="pl-6">
              <Icon name="lock" /> Private
            </div>
          )}
        </div>
        {props.showHelp && (
          <div>
            <ButtonWithIcon
              onClick={props.showHelp}
              icon={<Icon name="question" />}
              text="Help"
            />
          </div>
        )}
      </div>
      <div className="description">
        <ReactMarkdown source={props.calculator.content} />
      </div>
      <div className="inputs">
        {props.inputs.map((metric, i) => (
          <Input
            ref={(ref) => inputRefs.current.set(metric.id, ref)}
            key={metric.id}
            id={metric.id}
            isFirst={i === 0}
            name={metric.name}
            description={metric.guesstimate.description}
            errors={_simulation.errors(metric.simulation)}
            onBlur={(input) => handleBlur(metric, input)}
            onChange={(input) => handleChange(metric, input)}
            onEnter={handleEnter}
            initialValue={(props.startFilled && metric.guesstimate.input) || ""}
          />
        ))}
      </div>
      {state.showResult ? (
        <div>
          <hr className="result-divider" />
          <div className="outputs">
            {props.outputs.map((m) => (
              <Output key={m.id} metric={m} />
            ))}
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-xs-12 col-md-7" />
          <div className="col-xs-12 col-md-5">
            <div
              className={clsx(
                "ui button calculateButton",
                state.resultComputing
                  ? "loading"
                  : state.readyToCalculate
                  ? ""
                  : "disabled"
              )}
              onClick={() => {
                allOutputsHaveStats()
                  ? showResult()
                  : setState({ ...state, resultComputing: true });
              }}
            >
              Calculate
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
