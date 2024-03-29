import _ from "lodash";
import * as e from "~/lib/engine/engine";
import { addSimulationToFact } from "~/modules/facts/actions";
import { Guesstimate } from "~/modules/guesstimates/reducer";
import { Metric } from "~/modules/metrics/reducer";
import { addSimulation } from "~/modules/simulations/actions";
import { Simulation } from "~/modules/simulations/reducer";
import { AppDispatch, RootState } from "~/modules/store";

import { DenormalizedMetric } from "../engine/metric";
import { ApiSpace } from "../guesstimate_api/resources/Models";
import { NODE_TYPES } from "./constants";
import { SimulationNodeParams } from "./DAG";
import { ERROR_TYPES } from "./errors";
import { Simulator, SimulatorOptions } from "./simulator";

export type GraphFilters = {
  factId?: number;
  spaceId?: number;
  metricId?: string;
  onlyHead?: boolean;
  notHead?: boolean;
  simulateSubsetFrom?: string[];
  simulateSubset?: string[];
};

function getSpacesAndOrganization(
  state: RootState,
  graphFilters: GraphFilters
) {
  const spaces: (ApiSpace | null | undefined)[] = [];
  let organization = null;

  if (graphFilters.factId) {
    const organizationFact = state.facts.organizationFacts.find(
      ({ children }) => e.collections.some(children, graphFilters.factId)
    );
    const fact: any = e.collections.get(
      _.get(organizationFact, "children"),
      graphFilters.factId
    );
    if (!_.isEmpty(fact.imported_to_intermediate_space_ids)) {
      const orgId = e.organization.organizationIdFromFactReadableId(
        organizationFact.variable_name
      );
      organization = e.collections.get(state.organizations, orgId);
      const organizationSpaces = e.collections.filter(
        state.spaces,
        orgId,
        "organization_id"
      );
      spaces.push(
        ...organizationSpaces.filter(
          (s) => s.exported_facts_count > 0 && !_.isEmpty(s.imported_fact_ids)
        )
      );
    }
  } else if (graphFilters.spaceId) {
    spaces.push(e.collections.get(state.spaces, graphFilters.spaceId));
    organization = e.collections.get(
      state.organizations,
      _.get(spaces[0], "organization_id")
    );
  } else if (graphFilters.metricId) {
    const spaceId = e.collections.gget(
      state.metrics,
      graphFilters.metricId,
      "id",
      "space"
    );
    spaces.push(e.collections.get(state.spaces, spaceId));
    organization = e.collections.get(
      state.organizations,
      _.get(spaces[0], "organization_id")
    );
  }

  return {
    spaces: spaces.filter((s): s is NonNullable<typeof s> => !!s),
    organization,
  };
}

// TODO(matthew): Find a way to test this through the public API.
export function getSubset(state: RootState, graphFilters: GraphFilters) {
  const { spaces, organization } = getSpacesAndOrganization(
    state,
    graphFilters
  );

  if (_.isEmpty(spaces)) {
    return {
      subset: { metrics: [], guesstimates: [], simulations: [] },
      relevantFacts: [],
    };
  }
  const spaceIds = spaces.map((s) => s.id);

  const subset = e.space.subset(state, ...spaceIds);
  const organizationFacts = e.facts.getFactsForOrg(
    state.facts.organizationFacts,
    organization
  );

  const { organizationFactsUsed, globalFactsUsed } =
    e.facts.getRelevantFactsAndReformatGlobals(
      subset,
      state.facts.globalFacts,
      organizationFacts,
      spaces.map((s) => s.id)
    );

  // When should facts be simulatable?
  //
  // This logic is a bit dicey, and very tempermental, so it warrants an explanation.
  // We only want to simulate facts if the user is in editing mode on a space; you don't want to redefine their global
  // fact store if they are just arbitrarily adjusting parameters, for example. View mode or edit mode is determined by
  // one of two things: either the canvasState flags edits as being allowed or not, or the space's permissions itself
  // can forbid editing by a user. But, as our permission system right now prohibits the use of (or exporting of) facts
  // from spaces that the user doesn't have permission to edit, this second restriction is moot; if you can't edit the
  // space you can't be simulating output facts in the first place.  Therefore, the only restriction that defines
  // whether or not the user is in editing mode that is relevant when there are possible output facts is the canvas
  // state. In particular, a user is in edit mode (and thus we should simulate facts) when the canvasState editsAllowed
  // field is manually set to true.
  //
  // However, there is one additional caveat. If we are simulating facts as part of a downstream propagation from an
  // upstream fact change, then we want to simulate facts independently of canvasState. This is indicated by whether or
  // not the graphFilters object has the `factId` field set.
  //
  // Additionally, we never want to simulate input facts, or facts not exported by the space we're simulating.
  //
  // So, our final condition as to whether or not we want to simulate a given fact f is:
  //   ([can edit] OR [simulating fact descendants]) AND [fact is output]
  const {
    canvasState: { editsAllowed, editsAllowedManuallySet },
  } = state;
  const allowedToSimulateOutputFact =
    !!graphFilters.factId || !editsAllowedManuallySet || editsAllowed;

  const organizationFactsFlaggedAsSimulatable = organizationFactsUsed.map(
    (f) => ({
      ...f,
      shouldBeSimulated:
        allowedToSimulateOutputFact &&
        spaceIds.includes(_.get(f, "exported_from_id")),
    })
  );

  const globalFactHandleToNodeIdMap = _.transform(
    globalFactsUsed,
    (resultMap, globalFact) => {
      resultMap[globalFact.variable_name] = e.guesstimate.expressionSyntaxPad(
        globalFact.id,
        false
      );
    },
    {}
  );

  subset.guesstimates = subset.guesstimates.map((g) => ({
    ...g,
    expression: e.utils.replaceByMap(g.expression, globalFactHandleToNodeIdMap),
  }));

  return {
    subset,
    relevantFacts: [
      ...organizationFactsFlaggedAsSimulatable,
      ...globalFactsUsed,
    ],
  };
}

const nodeIdToMetricId = (id: string) =>
  id.slice(e.simulation.METRIC_ID_PREFIX.length);
const nodeIdToFactId = (id: string) =>
  id.slice(e.simulation.FACT_ID_PREFIX.length);
const nodeIdIsMetric = (id: string) =>
  id.includes(e.simulation.METRIC_ID_PREFIX);

function guesstimateTypeToNodeType(guesstimateType) {
  switch (guesstimateType) {
    case "FUNCTION":
      return NODE_TYPES.FUNCTION;
    case "DATA":
      return NODE_TYPES.DATA;
    default:
      return NODE_TYPES.USER_INPUT;
  }
}

const filterErrorsFn = (e) => e.type !== ERROR_TYPES.GRAPH_ERROR;

export const metricIdToNodeId = (id: string) =>
  `${e.simulation.METRIC_ID_PREFIX}${id}`;

const metricToSimulationNodeFn = (
  m: DenormalizedMetric
): SimulationNodeParams => ({
  id: metricIdToNodeId(m.id),
  type: guesstimateTypeToNodeType(m.guesstimate.guesstimateType),
  guesstimateType: m.guesstimate.guesstimateType,
  expression: m.guesstimate.expression,
  samples:
    m.guesstimate.guesstimateType === "DATA"
      ? e.utils.orArr(m.guesstimate?.data)
      : e.simulation.values(m.simulation),
  errors: e.utils
    .mutableCopy(e.simulation.errors(m.simulation))
    .filter(filterErrorsFn),
});

const factIdToNodeId = (id) => `${e.simulation.FACT_ID_PREFIX}${id}`;
const factToSimulationNodeFn = (f): SimulationNodeParams => ({
  id: factIdToNodeId(f.id),
  expression: f.expression,
  type: NODE_TYPES.UNSET, // Facts are currently type-less.
  guesstimateType: null, // Facts are currently type-less.
  samples: e.simulation.values(f.simulation),
  errors: e.utils
    .mutableCopy(e.simulation.errors(f.simulation))
    .filter(filterErrorsFn),
  skipSimulating: !_.get(f, "shouldBeSimulated"),
});

function denormalize({
  metrics,
  guesstimates,
  simulations,
}: {
  metrics: Metric[];
  guesstimates: Guesstimate[];
  simulations: Simulation[];
}): DenormalizedMetric[] {
  return metrics.map((m) => {
    const guesstimate = e.collections.get(guesstimates, m.id, "metric");
    if (!guesstimate) {
      throw new Error(`Guesstimate not found for metric ${m.id}`);
    }
    return {
      ...m,
      guesstimate,
      simulation: e.collections.get(simulations, m.id, "metric"),
    };
  });
}

const allPresent = (obj: unknown, ...props: string[]) =>
  props.map((p) => present(obj, p)).reduce((x, y) => x && y, true);
const present = (obj: unknown, prop: string) =>
  _.has(obj, prop) && (!!_.get(obj, prop) || _.get(obj, prop) === 0);

function translateOptions(graphFilters: GraphFilters): SimulatorOptions {
  if (allPresent(graphFilters, "factId")) {
    return { simulateStrictSubsetFrom: [factIdToNodeId(graphFilters.factId)] };
  }
  if (graphFilters.metricId !== undefined && graphFilters.onlyHead) {
    return { simulateIds: [metricIdToNodeId(graphFilters.metricId)] };
  }
  if (graphFilters.metricId !== undefined && graphFilters.notHead) {
    return {
      simulateStrictSubsetFrom: [metricIdToNodeId(graphFilters.metricId)],
    };
  }
  if (graphFilters.simulateSubsetFrom) {
    return {
      simulateSubsetFrom: graphFilters.simulateSubsetFrom.map(metricIdToNodeId),
    };
  }
  if (graphFilters.simulateSubset) {
    return { simulateIds: graphFilters.simulateSubset.map(metricIdToNodeId) };
  }
  return {};
}

const getCurrPropId =
  (state: RootState) =>
  (nodeId: string): number => {
    if (nodeIdIsMetric(nodeId)) {
      const metricId = nodeIdToMetricId(nodeId);
      return e.collections.gget(
        state.simulations,
        metricId,
        "metric",
        "propagationId"
      );
    } else {
      const factId = nodeIdToFactId(nodeId);

      const organizationFact = state.facts.organizationFacts.find(
        ({ children }) => e.collections.some(children, factId)
      );
      const fact = e.collections.get(
        _.get(organizationFact, "children"),
        factId
      );
      return e.utils.orZero(_.get(fact, "simulation.propagationId"));
    }
  };

export function simulate(
  dispatch: AppDispatch,
  getState: () => RootState,
  graphFilters: GraphFilters
) {
  const state = getState();
  const shouldTriggerDownstreamFactSimulations = !graphFilters.factId;

  const { subset, relevantFacts } = getSubset(state, graphFilters);
  const denormalizedMetrics = denormalize(subset);

  const nodes = [
    ..._.map(denormalizedMetrics, metricToSimulationNodeFn),
    ..._.map(relevantFacts, factToSimulationNodeFn),
  ];

  if (!nodes.length) {
    return;
  }

  const propagationId = new Date().getTime();

  const yieldMetricSims = (nodeId: string, { samples, errors }) => {
    const metric = nodeIdToMetricId(nodeId);
    const newSimulation: Simulation = {
      metric,
      propagationId,
      sample: {
        values: _.isEmpty(errors) ? samples : [],
        errors,
      },
    };
    dispatch(addSimulation(newSimulation));
  };

  const yieldFactSims = (nodeId: string, { samples, errors }) => {
    // TODO(matthew): Proper error handling...
    if (!_.isEmpty(errors)) {
      return;
    }

    const factId = nodeIdToFactId(nodeId);
    const newSimulation = {
      propagationId,
      sample: {
        values: _.isEmpty(errors) ? samples : [],
        errors: Object.assign([], errors),
      },
    };
    dispatch(
      addSimulationToFact(
        newSimulation,
        factId,
        shouldTriggerDownstreamFactSimulations
      )
    );
  };

  const yieldSims = (nodeId: string, sim) => {
    nodeIdIsMetric(nodeId)
      ? yieldMetricSims(nodeId, sim)
      : yieldFactSims(nodeId, sim);
  };

  const simulator = new Simulator(
    nodes,
    e.simulation.NUM_SAMPLES,
    translateOptions(graphFilters),
    propagationId,
    yieldSims,
    getCurrPropId(state)
  );
  simulator.run();
}
