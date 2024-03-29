import { FC, useCallback, useEffect, useMemo, useRef } from "react";

import _ from "lodash";
import { EdgeShape, PathStatus } from "~/components/lib/FlowGrid/Edges";
import { FlowGrid } from "~/components/lib/FlowGrid/FlowGrid";
import { GridItem } from "~/components/lib/FlowGrid/types";
import { MetricCard } from "~/components/metrics/MetricCard/index";
import { isMac } from "~/components/utility/isMac";
import * as _collections from "~/lib/engine/collections";
import { hasErrors } from "~/lib/engine/simulation";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import {
  CanvasLocation,
  Direction,
  existsAtLoc,
  isWithinRegion,
  MaybeRegion,
} from "~/lib/locationUtils";
import { fillRegion } from "~/modules/auto_fill_region/actions";
import * as canvasStateActions from "~/modules/canvas_state/actions";
import { redo, undo } from "~/modules/checkpoints/actions";
import * as copiedActions from "~/modules/copied/actions";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import {
  addMetric,
  changeMetric,
  removeMetrics,
} from "~/modules/metrics/actions";
import { changeSelect, deSelect } from "~/modules/selectedCell/actions";
import { deSelectRegion, selectRegion } from "~/modules/selectedRegion/actions";
import {
  deleteSimulations,
  runSimulations,
} from "~/modules/simulations/actions";

import { ExtendedDSpace } from "../denormalized-space-selector";

type Props = {
  denormalizedSpace: ExtendedDSpace;
  screenshot?: boolean;
  exportedFacts: any;
  canUseOrganizationFacts: boolean;
};

export const SpaceCanvas: FC<Props> = ({
  screenshot = false,
  denormalizedSpace,
  canUseOrganizationFacts,
  exportedFacts,
}) => {
  const dispatch = useAppDispatch();
  const copied = useAppSelector((state) => state.copied);
  const selectedCell = useAppSelector((state) => state.selectedCell);
  const selectedRegion = useAppSelector((state) => state.selectedRegion);

  // previously: componentDidUpdate
  const denormalizedSpaceRef = useRef<ExtendedDSpace>(denormalizedSpace);
  useEffect(() => {
    const { metrics } = denormalizedSpace;
    const oldMetrics = denormalizedSpaceRef.current.metrics;

    if (oldMetrics.length === 0 && metrics.length > 0) {
      dispatch(runSimulations({ spaceId: denormalizedSpace.id }));
    }

    denormalizedSpaceRef.current = denormalizedSpace;
  });

  useEffect(() => {
    const { metrics } = denormalizedSpace;
    if (metrics.length > 19) {
      dispatch(canvasStateActions.change({ edgeView: "hidden" }));
    } else {
      dispatch(canvasStateActions.change({ edgeView: "visible" }));
    }
    dispatch(runSimulations({ spaceId: denormalizedSpace.id }));

    // on unmount
    return () => {
      // uses the latest denormalizedSpace through ref
      dispatch(
        deleteSimulations(denormalizedSpaceRef.current.metrics.map((m) => m.id))
      );
      dispatch(canvasStateActions.endAnalysis());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { metrics, canvasState } = denormalizedSpace;
  const analyzedMetric = _.isEmpty(canvasState.analysisMetricId)
    ? undefined
    : metrics.find((e) => e.id === canvasState.analysisMetricId);

  const showEdges = canvasState.edgeView === "visible";

  const findMetric = useCallback(
    (metricId: string) => {
      return metrics.find((m) => m.id === metricId);
    },
    [metrics]
  );

  const getSelectedLineage = useCallback(
    (selectedRegion: MaybeRegion) => {
      const selectedMetrics = metrics.filter((m) =>
        isWithinRegion(m.location, selectedRegion)
      );

      let ancestors = [...selectedMetrics],
        descendants = [...selectedMetrics];
      const getAncestors = (metrics: FullDenormalizedMetric[]) =>
        _.uniq(_.flatten(metrics.map((m) => m.edges.inputs)))
          .filter((id) => !_.some(ancestors, (a) => a.id === id))
          .map((id) => findMetric(id))
          .filter((m): m is NonNullable<typeof m> => !!m);

      const getDescendants = (metrics: FullDenormalizedMetric[]) =>
        _.uniq(_.flatten(metrics.map((m) => m.edges.outputs)))
          .filter((id) => !_.some(descendants, (d) => d.id === id))
          .map((id) => findMetric(id))
          .filter((m): m is NonNullable<typeof m> => !!m);

      let nextAncestors = getAncestors(ancestors);
      let nextDescendants = getDescendants(descendants);

      while (nextAncestors.length > 0 || nextDescendants.length > 0) {
        ancestors = [...ancestors, ...nextAncestors];
        descendants = [...descendants, ...nextDescendants];

        nextAncestors = getAncestors(nextAncestors);
        nextDescendants = getDescendants(nextDescendants);
      }

      return { ancestors, descendants };
    },
    [findMetric, metrics]
  );

  const makeItem = useCallback(
    (metric: FullDenormalizedMetric): GridItem => {
      const analyzedSamples = _.get(analyzedMetric, "simulation.sample.values");
      const hasAnalyzed =
        analyzedMetric &&
        metric &&
        analyzedSamples &&
        !_.isEmpty(analyzedSamples);

      const analyzedRegion: MaybeRegion = analyzedMetric
        ? [analyzedMetric.location, analyzedMetric.location]
        : [];
      const { ancestors, descendants } = getSelectedLineage(analyzedRegion); // FIXME - can be called just once
      const isRelatedToAnalyzed = _.some(
        [...ancestors, ...descendants],
        (relative) => relative.id === metric.id
      );

      const passAnalyzed = hasAnalyzed && isRelatedToAnalyzed;

      const organizationId = denormalizedSpace.organization_id;

      const idMap = _.transform(
        metrics || [],
        (res, curr) => {
          res[curr.id] = curr.readableId;
        },
        {}
      );

      const exportedAsFact = _collections.some(
        exportedFacts,
        metric.id,
        "metric_id"
      );

      const props = {
        canvasState,
        key: metric.id,
        metric,
        idMap,
        organizationId,
        canUseOrganizationFacts,
        exportedAsFact,
        analyzedMetric: passAnalyzed ? analyzedMetric : null,
        screenshot,
      };

      return {
        key: metric.id,
        location: metric.location,
        render: (context) => <MetricCard {...props} {...context} />,
        isEmpty:
          _.isEmpty(metric.name) &&
          _.isEmpty(metric.guesstimate.input) &&
          _.isEmpty(metric.guesstimate.data),
      };
    },
    [
      analyzedMetric,
      canUseOrganizationFacts,
      canvasState,
      denormalizedSpace.organization_id,
      exportedFacts,
      getSelectedLineage,
      metrics,
      screenshot,
    ]
  );

  const edges = useMemo<EdgeShape[] | undefined>(() => {
    if (!showEdges) {
      return;
    }

    const selectedMetrics = metrics.filter((m) =>
      isWithinRegion(m.location, selectedRegion)
    );

    const hasSelectedMetrics = selectedMetrics.length > 0;

    const unconnectedStatus: PathStatus = hasSelectedMetrics
      ? "unconnected"
      : screenshot
      ? "screenshot"
      : "default";

    const { ancestors, descendants } = getSelectedLineage(selectedRegion);

    return denormalizedSpace.edges
      .map((e) => {
        const inputMetric = findMetric(e.input);
        const outputMetric = findMetric(e.output);
        if (!inputMetric || !outputMetric) {
          return;
        }
        const { id: inputId, location: input, simulation } = inputMetric;
        const { id: outputId, location: output } = outputMetric;

        const outputIsAncestor = _collections.some(ancestors, outputId);
        const inputIsDescendant = _collections.some(descendants, inputId);

        const withinSelectedRegion =
          _collections.some(selectedMetrics, outputId) &&
          _collections.some(selectedMetrics, inputId);

        let pathStatus: PathStatus = unconnectedStatus;
        if (!withinSelectedRegion && (outputIsAncestor || inputIsDescendant)) {
          const isDegreeOne = _.some(selectedMetrics, ({ id }) =>
            [inputId, outputId].includes(id)
          );

          if (outputIsAncestor) {
            pathStatus = isDegreeOne ? "ancestor-1-degree" : "ancestor";
          } else {
            pathStatus = isDegreeOne ? "descendant-1-degree" : "descendant";
          }
        }

        return {
          input,
          output,
          pathStatus,
          hasErrors: hasErrors(simulation),
        };
      })
      .filter((e): e is NonNullable<typeof e> => !!e);
  }, [
    denormalizedSpace.edges,
    findMetric,
    getSelectedLineage,
    metrics,
    screenshot,
    selectedRegion,
    showEdges,
  ]);

  const copiedRegion =
    (copied && copied.pastedTimes < 1 && copied.region) || [];
  const analyzedRegion: MaybeRegion = analyzedMetric
    ? [analyzedMetric.location, analyzedMetric.location]
    : [];

  const handleUndo = useCallback(
    () => dispatch(undo(denormalizedSpace.id)),
    [denormalizedSpace.id]
  );
  const handleRedo = useCallback(
    () => dispatch(redo(denormalizedSpace.id)),
    [denormalizedSpace.id]
  );

  const handleCopy = useCallback(() => {
    if (screenshot) {
      return; // background regions don't work in embeds; TODO - should we enable these actions anyway?
    }
    dispatch(copiedActions.copy(denormalizedSpace.id));
  }, [screenshot, denormalizedSpace.id]);

  const handlePaste = useCallback(() => {
    if (screenshot) {
      return;
    }
    dispatch(copiedActions.paste(denormalizedSpace.id));
  }, [screenshot, denormalizedSpace.id]);

  const handleCut = useCallback(() => {
    if (screenshot) {
      return;
    }
    dispatch(copiedActions.cut(denormalizedSpace.id));
  }, [screenshot, denormalizedSpace.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof Element &&
        ["INPUT", "TEXTAREA"].includes(e.target.tagName)
      ) {
        return;
      }

      if (e.ctrlKey || (isMac() && e.metaKey)) {
        if (e.keyCode == 86) {
          // ctrl+v
          handlePaste();
        } else if (e.keyCode == 67) {
          // ctrl+c
          handleCopy();
        } else if (e.keyCode == 88) {
          // ctrl+x
          handleCut();
        } else if (e.keyCode == 90 && !e.shiftKey) {
          // ctrl+z
          handleUndo();
          e.preventDefault();
        } else if (e.keyCode == 89 || (e.keyCode == 90 && e.shiftKey)) {
          // ctrl+y or ctrl+shift+z
          handleRedo();
          e.preventDefault();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("down", handler);
  }, [handleUndo, handleRedo, handlePaste, handleCopy, handleCut]);

  const handleSelect = useCallback(
    (location: CanvasLocation, selectedFrom?: Direction) => {
      dispatch(changeSelect(location, selectedFrom));
      dispatch(selectRegion(location, location));
    },
    []
  );

  const handleMultipleSelect = useCallback(
    (corner1: CanvasLocation, corner2: CanvasLocation) => {
      dispatch(selectRegion(corner1, corner2));
    },
    []
  );

  const handleDeSelectAll = useCallback(() => {
    dispatch(deSelect());
    dispatch(deSelectRegion());
  }, []);

  const onAutoFillRegion = useCallback(
    (region: { start: CanvasLocation; end: CanvasLocation }) => {
      dispatch(fillRegion(denormalizedSpace.id, region));
    },
    [denormalizedSpace.id]
  );

  const handleAddMetric = useCallback(
    (location: CanvasLocation) => {
      dispatch(
        addMetric({
          space: denormalizedSpace.id,
          location,
        })
      );
    },
    [denormalizedSpace.id]
  );

  const handleMoveMetric = useCallback(
    ({ prev, next }: { prev: CanvasLocation; next: CanvasLocation }) => {
      if (_.some(denormalizedSpace.metrics, existsAtLoc(next))) {
        return;
      }

      const metric = denormalizedSpace.metrics.find(existsAtLoc(prev));
      if (!metric) {
        return;
      }
      dispatch(changeMetric({ id: metric.id, location: next }));
      dispatch(changeSelect(next));
    },
    [denormalizedSpace.metrics]
  );

  const handleRemoveItems = useCallback((ids: string[]) => {
    dispatch(removeMetrics(ids));
  }, []);

  const items = useMemo(
    () => metrics.map((m) => makeItem(m)),
    [metrics, makeItem]
  );

  return (
    <div className="overflow-auto">
      <FlowGrid
        items={items}
        edges={edges}
        selectedCell={selectedCell}
        selectedRegion={selectedRegion}
        copiedRegion={copiedRegion}
        analyzedRegion={analyzedRegion}
        showGridLines={!screenshot}
        // the identity of these action should be mostly stable; handleMoveMetric is an exception though
        onSelectItem={handleSelect}
        onMultipleSelect={handleMultipleSelect}
        onDeSelectAll={handleDeSelectAll}
        onAutoFillRegion={onAutoFillRegion}
        onAddItem={handleAddMetric}
        onMoveItem={handleMoveMetric}
        onRemoveItems={handleRemoveItems}
      />
    </div>
  );
};
