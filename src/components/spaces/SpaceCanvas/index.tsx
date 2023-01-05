import _ from "lodash";
import { useEffect, useRef } from "react";

import FlowGrid from "~/components/lib/FlowGrid/FlowGrid";
import Metric from "~/components/metrics/card/index";

import { fillRegion } from "~/modules/auto_fill_region/actions";
import * as canvasStateActions from "~/modules/canvas_state/actions";
import { redo, undo } from "~/modules/checkpoints/actions";
import {
  addMetric,
  changeMetric,
  removeMetrics,
} from "~/modules/metrics/actions";
import { changeSelect, deSelect } from "~/modules/selected_cell/actions";
import {
  deSelectRegion,
  selectRegion,
} from "~/modules/selected_region/actions";
import {
  deleteSimulations,
  runSimulations,
} from "~/modules/simulations/actions";

import * as _collections from "~/lib/engine/collections";
import { hasErrors } from "~/lib/engine/simulation";

import { hasMetricUpdated } from "~/components/metrics/card/updated";

import { GridItem } from "~/components/lib/FlowGrid/types";
import { FullDenormalizedMetric } from "~/lib/engine/space";
import {
  existsAtLoc,
  isWithinRegion,
  Location,
  MaybeRegion,
} from "~/lib/locationUtils";
import { useAppDispatch, useAppSelector } from "~/modules/hooks";
import { ExtendedDSpace } from "../denormalized-space-selector";

export type EdgeShape = {
  input: Location;
  output: Location;
  pathStatus: string;
  hasErrors: boolean;
};

type Props = {
  denormalizedSpace: ExtendedDSpace;
  screenshot?: boolean;
  exportedFacts: any;
  canUseOrganizationFacts: boolean;
  onCut?(): void;
  onCopy?(): void;
  onPaste?(): void;
};

export const SpaceCanvas: React.FC<Props> = ({
  screenshot = false,
  denormalizedSpace,
  canUseOrganizationFacts,
  onCopy,
  onPaste,
  onCut,
  exportedFacts,
}) => {
  const dispatch = useAppDispatch();
  const copied = useAppSelector((state) => state.copied);
  const selectedCell = useAppSelector((state) => state.selectedCell);
  const selectedRegion = useAppSelector((state) => state.selectedRegion);

  // for simulating componentWillUnmount and componentDidUpdate
  const denormalizedSpaceRef = useRef<ExtendedDSpace>(denormalizedSpace);
  useEffect(() => {
    const metrics = denormalizedSpace.metrics;
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

    return () => {
      // uses the latest denormalizedSpace through ref
      dispatch(
        deleteSimulations(denormalizedSpaceRef.current.metrics.map((m) => m.id))
      );
      dispatch(canvasStateActions.endAnalysis());
    };
  }, []);

  const { metrics, canvasState } = denormalizedSpace;
  const analyzedMetric = _.isEmpty(canvasState.analysisMetricId)
    ? undefined
    : metrics.find((e) => e.id === canvasState.analysisMetricId);

  const showEdges = canvasState.edgeView === "visible";

  const findMetric = (metricId: string) => {
    return metrics.find((m) => m.id === metricId);
  };

  const getSelectedLineage = (selectedRegion: MaybeRegion) => {
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
  };

  const makeItem = (metric: FullDenormalizedMetric): GridItem => {
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
      isInScreenshot: screenshot,
      canvasState,
      key: metric.id,
      metric,
      idMap,
      organizationId,
      canUseOrganizationFacts,
      exportedAsFact,
      analyzedMetric: passAnalyzed ? analyzedMetric : null,
    };

    return {
      key: metric.id,
      location: metric.location,
      component: (context) => <Metric {...props} {...context} />,
      props,
    };
  };

  const buildEdges = (): EdgeShape[] => {
    if (!showEdges) {
      return [];
    }

    const selectedMetrics = metrics.filter((m) =>
      isWithinRegion(m.location, selectedRegion)
    );

    const hasSelectedMetrics = selectedMetrics.length > 0;

    const unconnectedStatus = hasSelectedMetrics ? "unconnected" : "default";

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

        let pathStatus = unconnectedStatus;
        if (!withinSelectedRegion && (outputIsAncestor || inputIsDescendant)) {
          const isDegreeOne = _.some(selectedMetrics, ({ id }) =>
            [inputId, outputId].includes(id)
          );

          pathStatus = outputIsAncestor ? "ancestor" : "descendant";
          if (isDegreeOne) {
            pathStatus += "-1-degree";
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
  };

  const edges = buildEdges();
  let className = "canvas-space";
  className += showEdges ? " showEdges" : "";
  className += screenshot ? " overflow-hidden" : "";

  const showGridLines = !screenshot;

  const copiedRegion =
    (copied && copied.pastedTimes < 1 && copied.region) || [];
  const analyzedRegion: MaybeRegion = analyzedMetric
    ? [analyzedMetric.location, analyzedMetric.location]
    : [];

  const isMetricEmpty = (id: string) => {
    const metric = metrics.find((m) => m.id === id);
    if (!metric) {
      return false; // shouldn't happen
    }
    const { input, data } = metric.guesstimate;
    return _.isEmpty(metric.name) && _.isEmpty(input) && _.isEmpty(data);
  };

  const handleUndo = () => {
    dispatch(undo(denormalizedSpace.id));
  };

  const handleRedo = () => {
    dispatch(redo(denormalizedSpace.id));
  };

  const handleSelect = (location: Location, selectedFrom = null) => {
    dispatch(changeSelect(location, selectedFrom));
    dispatch(selectRegion(location, location));
  };

  const handleMultipleSelect = (corner1: Location, corner2: Location) => {
    dispatch(selectRegion(corner1, corner2));
  };

  const handleDeSelectAll = () => {
    dispatch(deSelect());
    dispatch(deSelectRegion());
  };

  const onAutoFillRegion = (region) => {
    dispatch(fillRegion(denormalizedSpace.id, region));
  };

  const handleAddMetric = (location: Location) => {
    dispatch(
      addMetric({
        space: denormalizedSpace.id,
        location,
      })
    );
  };

  const handleMoveMetric = ({
    prev,
    next,
  }: {
    prev: Location;
    next: Location;
  }) => {
    if (_.some(denormalizedSpace.metrics, existsAtLoc(next))) {
      return;
    }

    const metric = denormalizedSpace.metrics.find(existsAtLoc(prev));
    if (!metric) {
      return;
    }
    dispatch(changeMetric({ id: metric.id, location: next }));
    dispatch(changeSelect(next));
  };

  return (
    <div className={className}>
      <FlowGrid
        items={metrics.map((m) => makeItem(m))}
        onMultipleSelect={handleMultipleSelect}
        hasItemUpdated={(oldItem, newItem) =>
          hasMetricUpdated(oldItem.props, newItem.props)
        }
        isItemEmpty={isMetricEmpty}
        edges={edges}
        selectedRegion={selectedRegion}
        copiedRegion={copiedRegion}
        selectedCell={selectedCell}
        analyzedRegion={analyzedRegion}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSelectItem={handleSelect}
        onDeSelectAll={handleDeSelectAll}
        onAutoFillRegion={onAutoFillRegion}
        onAddItem={handleAddMetric}
        onMoveItem={handleMoveMetric}
        onRemoveItems={(ids) => {
          dispatch(removeMetrics(ids));
        }}
        onCopy={onCopy}
        onPaste={onPaste}
        onCut={onCut}
        showGridLines={showGridLines}
        canvasState={canvasState}
      />
    </div>
  );
};
