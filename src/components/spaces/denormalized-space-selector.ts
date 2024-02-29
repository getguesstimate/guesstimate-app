import _ from "lodash";
import { createSelector, createStructuredSelector } from "reselect";
import * as e from "~/lib/engine/engine";
import { DSpace } from "~/lib/engine/space";
import { CanvasState } from "~/modules/canvas_state/reducer";
import { CheckpointsState } from "~/modules/checkpoints/reducer";
import { RootState } from "~/modules/store";

const NAME = "Denormalized Space Selector";

function checkpointMetadata(id: number, checkpoints: CheckpointsState) {
  let attributes = { head: 0, length: 1 };
  const spaceCheckpoints = e.collections.get(checkpoints, id, "spaceId");
  if (!_.isEmpty(spaceCheckpoints)) {
    attributes = {
      head: spaceCheckpoints.head,
      length: spaceCheckpoints.checkpoints.length,
    };
  }
  return attributes;
}

export type ExtendedDSpace = DSpace & {
  canvasState: CanvasState;
  checkpointMetadata: {
    head: number;
    length: number;
  };
};

const SPACE_GRAPH_PARTS = [
  "spaces",
  "calculators",
  "metrics",
  "guesstimates",
  "simulations",
  "users",
  "organizations",
  "userOrganizationMemberships",
  "me",
  "checkpoints",
  "facts",
] as const;

const spaceGraphSelector = createStructuredSelector<
  RootState,
  { [k in (typeof SPACE_GRAPH_PARTS)[number]]: RootState[k] }
>(
  Object.fromEntries(
    SPACE_GRAPH_PARTS.map((part) => [part, (state: RootState) => state[part]])
  ) as any
);

const spaceIdSelector = (_: RootState, { spaceId }: { spaceId: number }) =>
  spaceId;
const canvasStateSelector = (state: RootState) => state.canvasState;

export const denormalizedSpaceSelector = createSelector(
  spaceGraphSelector,
  spaceIdSelector,
  canvasStateSelector,
  (graph, spaceId, canvasState) => {
    const {
      facts: { organizationFacts },
    } = graph;
    const denormalizedSpace = e.space.toDSpace(
      spaceId,
      graph,
      organizationFacts
    );

    const extendedDSpace = {
      ...denormalizedSpace,
      canvasState,
      checkpointMetadata: checkpointMetadata(spaceId, graph.checkpoints),
    };

    const { organization_id } = denormalizedSpace;
    const facts = e.organization.findFacts(organization_id, organizationFacts);

    const exportedFacts = e.collections.filter(
      facts,
      spaceId,
      "exported_from_id"
    );

    window.recorder.recordSelectorStop(NAME, { denormalizedSpace });

    return {
      denormalizedSpace: extendedDSpace,
      exportedFacts,
      organizationFacts: facts,
    };
  }
);
