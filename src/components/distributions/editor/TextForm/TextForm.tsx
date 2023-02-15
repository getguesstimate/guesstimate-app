import _ from "lodash";
import React, { useImperativeHandle, useRef, useState } from "react";

import { DistributionSelector } from "./DistributionSelector";
import { GuesstimateTypeIcon } from "./GuesstimateTypeIcon";
import { TextInput, UnconnectedTextInput } from "./TextInput";

import { DenormalizedMetric } from "~/lib/engine/metric";
import { Guesstimator } from "~/lib/guesstimator/index";
import { changeMetricClickMode } from "~/modules/canvas_state/actions";
import { useAppDispatch } from "~/modules/hooks";
import { Guesstimate } from "~/modules/guesstimates/reducer";

type Props = {
  guesstimate: Guesstimate;
  inputMetrics: DenormalizedMetric[];
  onChangeInput(text: string): void;
  onAddData(data: number[]): void;
  onSave(): void;
  size: "large" | "small";
  organizationId?: string | number;
  canUseOrganizationFacts: boolean;
  onAddDefaultData(): void;
  onChangeGuesstimateType(type: string): void;
  onTab(shifted: boolean): void;
  onReturn(shifted: boolean): void;
};

export const TextForm = React.forwardRef<{ focus(): void }, Props>(
  function TextForm(props, ref) {
    const inputRef = useRef<UnconnectedTextInput | null>(null);
    const [showDistributionSelector, setShowDistributionSelector] =
      useState(false);

    const dispatch = useAppDispatch();

    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus();
      },
    }));

    const {
      size,
      guesstimate: { input },
    } = props;

    const handleBlur = () => {
      dispatch(changeMetricClickMode("DEFAULT"));
      props.onSave();
    };

    const handleChangeInput = (input: string) => {
      props.onChangeInput(input);
      setShowDistributionSelector(false);
    };

    const flagMetricAsClicked = () => {
      if (props.guesstimate.guesstimateType === "FUNCTION") {
        dispatch(changeMetricClickMode("FUNCTION_INPUT_SELECT"));
      }
    };

    const textInput = () => {
      const {
        guesstimate: { input, guesstimateType },
        inputMetrics,
        organizationId,
        canUseOrganizationFacts,
        onAddData,
        onChangeGuesstimateType,
        onReturn,
        onTab,
      } = props;

      const shouldDisplayType = !(
        guesstimateType === "POINT" || guesstimateType === "FUNCTION"
      );
      const validInputReadableIds = inputMetrics
        .filter(
          (m) =>
            !_.get(m, "simulation.sample.errors.length") &&
            !!_.get(m, "simulation.sample.values.length")
        )
        .map((m) => m.readableId);
      const errorInputReadableIds = inputMetrics
        .filter(
          (m) =>
            !!_.get(m, "simulation.sample.errors.length") ||
            !_.get(m, "simulation.sample.values.length")
        )
        .map((m) => m.readableId);

      // To see if this guesstimate is a valid choice for a lognormal distribution, we'll try to parse it with
      // guesstimateType manually set to 'LOGNORMAL', and see if the parser corrects that type to something else. This
      // approach is a bit hacky, but it gets the job done.
      const [_1, parsed] = Guesstimator.parse({
        input,
        guesstimateType: "LOGNORMAL",
      });
      const parsedType = parsed.parsedInput?.guesstimateType;
      const isLognormalValid = parsedType === "LOGNORMAL";

      return (
        <div>
          <div className="flex gap-4 items-center">
            <TextInput
              value={input || ""}
              validInputs={validInputReadableIds}
              errorInputs={errorInputReadableIds}
              onReturn={onReturn}
              onTab={onTab}
              onChange={handleChangeInput}
              onFocus={flagMetricAsClicked}
              onBlur={handleBlur}
              onChangeData={onAddData}
              ref={inputRef}
              organizationId={organizationId}
              canUseOrganizationFacts={canUseOrganizationFacts}
            />

            {shouldDisplayType && (
              <GuesstimateTypeIcon
                guesstimateType={guesstimateType || ""}
                toggleDistributionSelector={() =>
                  setShowDistributionSelector(!showDistributionSelector)
                }
              />
            )}
          </div>

          {showDistributionSelector && (
            <div>
              <DistributionSelector
                disabledTypes={isLognormalValid ? [] : ["LOGNORMAL"]}
                onSubmit={onChangeGuesstimateType}
                selected={guesstimateType || ""}
              />
            </div>
          )}
        </div>
      );
    };

    if (size !== "large") {
      return textInput();
    }

    return (
      <div className="flex gap-4 items-center">
        <div className="flex-1">{textInput()}</div>
        {_.isEmpty(input) && (
          <div>
            <a className="custom-data" onClick={props.onAddDefaultData}>
              Add Custom Data
            </a>
          </div>
        )}
      </div>
    );
  }
);
