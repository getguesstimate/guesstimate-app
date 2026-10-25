import _ from "lodash";
import React, { useImperativeHandle, useRef, useState } from "react";

import { DistributionSelector } from "./DistributionSelector";
import { GuesstimateTypeIcon } from "./GuesstimateTypeIcon";
import { TextInput, UnconnectedTextInput } from "./TextInput";

import { DenormalizedMetric } from "~/lib/engine/metric";
import { Guesstimator } from "~/lib/guesstimator/index";
import { changeMetricClickMode } from "~/modules/canvas_state/actions";
import { GuesstimateWithInput } from "~/modules/guesstimates/reducer";
import { useAppDispatch } from "~/modules/hooks";

type Props = {
  guesstimate: GuesstimateWithInput;
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
  function TextForm(
    {
      size,
      guesstimate,
      inputMetrics,
      onAddData,
      onReturn,
      onTab,
      onChangeGuesstimateType,
      onSave,
      onChangeInput,
      onAddDefaultData,
      canUseOrganizationFacts,
      organizationId,
    },
    ref
  ) {
    const { guesstimateType } = guesstimate;

    const inputRef = useRef<UnconnectedTextInput | null>(null);
    const [showDistributionSelector, setShowDistributionSelector] =
      useState(false);

    const dispatch = useAppDispatch();

    useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current?.focus();
      },
    }));

    const handleBlur = () => {
      dispatch(changeMetricClickMode("DEFAULT"));
      onSave();
    };

    const handleChangeInput = (input: string) => {
      onChangeInput(input);
      setShowDistributionSelector(false);
    };

    const flagMetricAsClicked = () => {
      if (guesstimate.guesstimateType === "FUNCTION") {
        dispatch(changeMetricClickMode("FUNCTION_INPUT_SELECT"));
      }
    };

    const shouldDisplayType = !(
      guesstimateType === "POINT" || guesstimateType === "FUNCTION"
    );
    const samplerType = Guesstimator.samplerTypes.find(guesstimateType || "");
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
    const [, parsed] = Guesstimator.parse({
      input: guesstimate.input,
      guesstimateType: "LOGNORMAL",
    });
    const parsedType = parsed.parsedInput?.guesstimateType;
    const isLognormalValid = parsedType === "LOGNORMAL";

    const textInput = (
      <div>
        <div className="flex w-full items-center gap-4">
          {/* min-w-0 helps with overflows, see https://makandracards.com/makandra/66994-css-flex-and-min-width and https://github.com/tailwindlabs/tailwindcss/issues/10004#issuecomment-1337464731 */}
          <div className="min-w-0 flex-1">
            <TextInput
              value={guesstimate.input || ""}
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
              size={size}
            />
          </div>

          {size === "small" && shouldDisplayType && (
            <GuesstimateTypeIcon
              guesstimateType={guesstimateType || ""}
              toggleDistributionSelector={() =>
                setShowDistributionSelector(!showDistributionSelector)
              }
              size={size}
            />
          )}
        </div>

        {size === "large" && samplerType?.isRangeDistribution && (
          <button
            type="button"
            className="mt-2 rounded px-2 py-1 text-xs text-ink-muted hover:bg-accent-surface focus-visible:outline focus-visible:outline-2"
            aria-label={`Change distribution (${samplerType.displayName})`}
            aria-expanded={showDistributionSelector}
            onClick={() =>
              setShowDistributionSelector(!showDistributionSelector)
            }
          >
            Distribution: {samplerType.displayName}
          </button>
        )}

        {showDistributionSelector && (
          <DistributionSelector
            disabledTypes={isLognormalValid ? [] : ["LOGNORMAL"]}
            onSubmit={onChangeGuesstimateType}
            selected={guesstimateType || ""}
            size={size}
          />
        )}
      </div>
    );

    return size === "large" ? (
      <div className="w-full min-w-0">
        {textInput}
        {_.isEmpty(guesstimate.input) && !guesstimate.data && (
          <div className="mt-2">
            <button
              type="button"
              className="rounded px-2 py-1 text-xs font-medium text-ink-muted hover:bg-accent-surface focus-visible:outline focus-visible:outline-2"
              onClick={onAddDefaultData}
            >
              Add data
            </button>
          </div>
        )}
      </div>
    ) : (
      textInput
    );
  }
);
