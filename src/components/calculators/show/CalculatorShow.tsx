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

import { FullDenormalizedMetric } from "~/lib/engine/space";
import { Optional } from "~/lib/engine/types";
import { Guesstimator } from "~/lib/guesstimator/index";
import { Calculator } from "~/modules/calculators/reducer";
import { useAppDispatch } from "~/modules/hooks";
import styles from "../calculator.module.css";
import { FieldHelp } from "~/components/workspace/FieldHelp";

type Props = {
  calculator: Optional<Calculator, "id">;
  startFilled?: boolean;
  hideTitle?: boolean;
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

  const outputsReady = allOutputsHaveStats();
  const { onShowResult } = props;
  useEffect(() => {
    if (state.resultComputing && outputsReady) {
      setState((previous) => ({
        ...previous,
        resultComputing: false,
        showResult: true,
      }));
      onShowResult?.();
    }
  }, [state.resultComputing, outputsReady, onShowResult]);

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
    <div className={styles.surface}>
      {!props.hideTitle && (
        <div className="flex justify-between">
          <div className="flex items-end gap-6">
            <h1 className={styles.title}>{props.calculator.title}</h1>
            {props.isPrivate && (
              <div className="flex items-end gap-1">
                <Icon name="lock" />
                <div className="leading-none">Private</div>
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
      )}
      <div className={styles.description}>
        <ReactMarkdown source={props.calculator.content} skipHtml />
      </div>
      <div className={styles.sectionHeading}>
        <h3>Inputs</h3>
        <FieldHelp label="Help with calculator values">
          <p>
            Enter a number, such as 8, or an uncertain range, such as 6 to 12.
            These values are used for this calculation without saving changes to
            the model.
          </p>
        </FieldHelp>
      </div>
      <div className={styles.inputs}>
        {props.inputs.map((metric, i) => (
          <Input
            key={metric.id}
            ref={(ref) => {
              inputRefs.current.set(metric.id, ref);
            }}
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
        <div className={styles.results}>
          <div className={styles.sectionHeading}>
            <h3>Results</h3>
          </div>
          <div className={styles.inputs}>
            {props.outputs.map((m) => (
              <Output key={m.id} metric={m} />
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.footer} style={{ marginTop: 20 }}>
          <button
            type="button"
            className={styles.primary}
            aria-busy={state.resultComputing}
            disabled={!state.resultComputing && !readyToCalculate}
            onClick={() => {
              allOutputsHaveStats()
                ? showResult()
                : setState({ ...state, resultComputing: true });
            }}
          >
            {state.resultComputing ? "Calculating…" : "Calculate"}
          </button>
        </div>
      )}
    </div>
  );
};
