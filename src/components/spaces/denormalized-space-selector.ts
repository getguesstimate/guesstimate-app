import * as e from "~/lib/engine/engine";
import { DSpace } from "~/lib/engine/space";
import { RootState } from "~/modules/store";
import _ from "lodash";
import { createSelector } from "reselect";

const NAME = "Denormalized Space Selector";

function checkpointMetadata(id, checkpoints: any[]) {
  let attributes = { head: 0, length: 1 };
  let spaceCheckpoints = e.collections.get(checkpoints, id, "spaceId");
  if (!_.isEmpty(spaceCheckpoints)) {
    attributes = {
      head: spaceCheckpoints.head,
      length: spaceCheckpoints.checkpoints.length,
    };
  }
  return attributes;
}

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

export type ExtendedDSpace = DSpace & {
  canvasState: any;
  checkpointMetadata: any;
};

const spaceGraphSelector = (state: RootState) => {
  window.recorder.recordSelectorStart(NAME);
  return _.pick(state, SPACE_GRAPH_PARTS);
};
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

    const extendedDSpace = denormalizedSpace
      ? {
          ...denormalizedSpace,
          canvasState,
          checkpointMetadata: checkpointMetadata(spaceId, graph.checkpoints),
        }
      : (denormalizedSpace as any); /* FIXME - proper "not found" handling */

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
      organizationHasFacts: !_.isEmpty(facts),
    };
  }
);
