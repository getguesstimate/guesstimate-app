import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";

import ReactMarkdown from "react-markdown";
import Icon from "~/components/react-fa-patched";

import { ButtonWithIcon } from "~/components/utility/buttons/button";
import { Input, InputHandle } from "./Input";
import { Output } from "./Output";

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
import { DottedHR } from "./DottedHR";

type Props = {
  calculator: Optional<Calculator, "id">;
  startFilled?: boolean;
  inputs: FullDenormalizedMetric[];
  outputs: FullDenormalizedMetric[];
  isPrivate?: boolean;
  showHelp?(): void;
  onShowResult?(): void;
};

export const CalculatorShow: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();

  const allOutputsHaveStats = ({ outputs } = props) => {
    return outputs
      .map((o) => !!o && _.has(o, "simulation.stats"))
      .reduce((x, y) => x && y, true);
  };

  const [readyToCalculate, setReadyToCalculate] = useState(false);
  const [state, setState] = useState(() => ({
    resultComputing: false,
    showResult: props.startFilled && allOutputsHaveStats(),
    hasSimulated: false,
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
    input: string
  ) => {
    const parsed = Guesstimator.parse({ ...guesstimate, input });
    const guesstimateType = parsed[1].samplerType().referenceName;
    dispatch(
      changeGuesstimate(
        id,
        { data: null, input, guesstimateType },
        false // saveOnServer
      )
    );
  };

  const readyToSimulate = (metric: FullDenormalizedMetric, input: string) => {
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

  const handleBlur = (metric: FullDenormalizedMetric, input: string) => {
    // We only want to simulate anything if all the inputs have simulatable content.
    if (!state.hasSimulated && readyToSimulate(metric, input)) {
      _.defer(() => {
        props.inputs.forEach((i) =>
          doChangeGuesstimate(
            i,
            i.id === metric.id ? input : getInputContent(i) || ""
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

  const handleChange = (metric: FullDenormalizedMetric, input: string) => {
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
      setReadyToCalculate(true);
    } else {
      setReadyToCalculate(false);
    }
  };

  const handleEnter = (id: string) => {
    inputRefs.current.get(id)?.blur();
    if (!readyToCalculate) {
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

  const getInputContent = ({ id }: FullDenormalizedMetric) => {
    return inputRefs.current.get(id)?.getContent();
  };

  const showResult = () => {
    props.onShowResult?.();
    if (!state.showResult) {
      setState({ ...state, showResult: true });
    }
  };

  return (
    <div className="calculator">
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
      <div className="text-grey-666 my-4 text-sm">
        <ReactMarkdown source={props.calculator.content} />
      </div>
      <div className="space-y-2">
        {props.inputs.map((metric, i) => (
          <Input
            key={metric.id}
            ref={(ref) => inputRefs.current.set(metric.id, ref)}
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
          <div className="my-4">
            <DottedHR />
          </div>
          <div className="space-y-2">
            {props.outputs.map((m) => (
              <Output key={m.id} metric={m} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 flex justify-end">
          <div
            className={clsx(
              "ui button green large",
              state.resultComputing
                ? "loading"
                : readyToCalculate
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
      )}
    </div>
  );
};
