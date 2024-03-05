import React, { useEffect, useImperativeHandle, useRef } from "react";

import { TextForm } from "./TextForm/TextForm";

import { changeMetricClickMode } from "~/modules/canvas_state/actions";
import { changeGuesstimate } from "~/modules/guesstimates/actions";
import { runFormSimulations } from "~/modules/simulations/actions";

import clsx from "clsx";
import { Guesstimator } from "~/lib/guesstimator/index";
import { MetricClickMode } from "~/modules/canvas_state/reducer";
import {
  Guesstimate,
  GuesstimateWithInput,
} from "~/modules/guesstimates/reducer";
import { useAppDispatch } from "~/modules/hooks";
import { LargeDataViewer, SmallDataViewer } from "./DataForm/DataViewer";
import { DenormalizedMetric } from "~/lib/engine/metric";

type Props = {
  metricClickMode: MetricClickMode;
  guesstimate: GuesstimateWithInput;
  metricId: string;
  onReturn?(): void;
  onTab?(): void;
  jumpSection?(): void;
  canUseOrganizationFacts: boolean;
  organizationId?: string | number;
  inputMetrics: DenormalizedMetric[];
} & (
  | {
      size: "large";
    }
  | {
      size: "small";
      onOpen(): void;
    }
);

export const DistributionEditor = React.forwardRef<{ focus(): void }, Props>(
  function DistributionEditor(props, ref) {
    const {
      guesstimate,
      inputMetrics,
      organizationId,
      canUseOrganizationFacts,
    } = props;

    const formRef = useRef<{ focus(): void } | null>(null);
    const dispatch = useAppDispatch();

    const prevPropsRef = useRef<Props | undefined>();

    useEffect(() => {
      const prevProps = prevPropsRef.current;
      if (
        prevProps &&
        props.guesstimate.input !== prevProps.guesstimate.input &&
        props.guesstimate.guesstimateType !== "FUNCTION" &&
        prevProps.guesstimate.guesstimateType === "FUNCTION"
      ) {
        dispatch(changeMetricClickMode("DEFAULT"));
      }
    }, [props.guesstimate]);

    useEffect(() => {
      prevPropsRef.current = props;
    });

    useImperativeHandle(ref, () => ({
      focus() {
        formRef.current?.focus();
      },
    }));

    if (guesstimate.metric !== props.metricId) {
      return null;
    }

    const dispatchChanges = (
      changes: Partial<Guesstimate> & { input?: string },
      runFormSims: boolean,
      saveToServer: boolean
    ) => {
      dispatch(changeGuesstimate(props.metricId, changes, saveToServer));
      if (runFormSims) {
        dispatch(runFormSimulations(props.metricId));
      }
    };

    const handleTab = (shifted: boolean) => {
      if (shifted) {
        props.jumpSection?.();
      } else {
        props.onTab?.();
      }
    };

    const handleReturn = (shifted: boolean) => {
      if (shifted) {
        props.jumpSection?.();
      } else {
        props.onReturn?.();
      }
    };

    const handleChangeInput = (input: string) => {
      const guesstimateType = Guesstimator.parse({
        ...props.guesstimate,
        input,
      })[1].samplerType().referenceName;

      dispatchChanges({ data: null, input, guesstimateType }, true, false);
      if (guesstimateType === "FUNCTION") {
        dispatch(changeMetricClickMode("FUNCTION_INPUT_SELECT"));
      }
    };

    const handleSave = () => {
      dispatchChanges({}, false, true);
    };

    const handleChangeGuesstimateType = (guesstimateType) => {
      dispatchChanges({ guesstimateType }, true, true);
    };

    const addDataAndSave = (data: number[] | null) => {
      dispatchChanges({ guesstimateType: "DATA", data }, true, true);
    };

    const deleteDataAndSave = () => {
      addDataAndSave(null);
    };

    if (guesstimate.data) {
      return props.size === "large" ? (
        <LargeDataViewer
          data={guesstimate.data}
          onDelete={deleteDataAndSave}
          onSave={addDataAndSave}
        />
      ) : (
        <SmallDataViewer onDelete={deleteDataAndSave} onOpen={props.onOpen} />
      );
    }

    return (
      <TextForm
        guesstimate={guesstimate}
        inputMetrics={inputMetrics}
        onAddData={addDataAndSave}
        onChangeInput={handleChangeInput}
        onChangeGuesstimateType={handleChangeGuesstimateType}
        onSave={handleSave}
        onAddDefaultData={() => {
          addDataAndSave([1, 2, 3]);
        }}
        onReturn={handleReturn}
        onTab={handleTab}
        size={props.size}
        organizationId={organizationId}
        canUseOrganizationFacts={canUseOrganizationFacts}
        ref={formRef}
      />
    );
  }
);
