import _ from "lodash";
import React, { useImperativeHandle, useRef, useState } from "react";

import { DistributionSelector } from "./DistributionSelector";
import { GuesstimateTypeIcon } from "./GuesstimateTypeIcon";
import { TextInput, UnconnectedTextInput } from "./TextInput";

import { Guesstimator } from "~/lib/guesstimator/index";

type Props = {
  guesstimate: any;
  inputMetrics: any;
  onChangeInput(text: string): void;
  onChangeClickMode(mode?: string): void; // TODO - enum?
  onAddData(data: number[]): void;
  onSave(): void;
  size: string;
  organizationId?: string | number;
  canUseOrganizationFacts: boolean;
  onAddDefaultData(): void;
  onChangeGuesstimateType(type: string): void;
  onTab(shifted: boolean): void;
  onReturn(shifted: boolean): void;
  //   onChangeClickMode: PropTypes.func,
  //   onFocus: PropTypes.func,
};

export const TextForm = React.forwardRef<{ focus(): void }, Props>(
  (props, ref) => {
    const inputRef = useRef<UnconnectedTextInput | null>(null);
    const [showDistributionSelector, setShowDistributionSelector] =
      useState(false);

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
      props.onChangeClickMode();
      props.onSave();
    };

    const handleChangeInput = (input: string) => {
      props.onChangeInput(input);
      setShowDistributionSelector(false);
    };

    const flagMetricAsClicked = () => {
      if (props.guesstimate.guesstimateType === "FUNCTION") {
        props.onChangeClickMode("FUNCTION_INPUT_SELECT");
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
              value={input}
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
                guesstimateType={guesstimateType}
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
                selected={guesstimateType}
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
