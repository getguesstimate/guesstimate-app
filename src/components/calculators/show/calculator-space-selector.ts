import _ from "lodash";
import { createSelector } from "reselect";
import * as e from "~/lib/engine/engine";
import { RootState } from "~/modules/store";

const _sameId = (idA: string | number, idB: string | number) =>
  idA.toString() === idB.toString();

const spaceGraphSelector = (state: RootState) =>
  _.pick(state, [
    "me",
    "users",
    "organizations",
    "userOrganizationMemberships",
    "spaces",
    "metrics",
    "guesstimates",
    "simulations",
    "calculators",
  ]);

const organizationFactsSelector = (state: RootState) =>
  state.facts.organizationFacts;

const calculatorSelector = (state: RootState, calculatorId: number) =>
  state.calculators.find((c) => _sameId(c.id, calculatorId));

export const calculatorSpaceSelector = createSelector(
  spaceGraphSelector,
  organizationFactsSelector,
  calculatorSelector,
  (graph, organizationFacts, calculator) => {
    if (!calculator || !_.has(calculator, "space_id")) {
      return {};
    }
    const { metrics, is_private } = e.space.toDSpace(
      calculator.space_id,
      graph,
      organizationFacts
    );

    const findById = (id: string) => metrics.find((m) => _sameId(m.id, id));

    const inputs = calculator.input_ids
      .map(findById)
      .filter(
        (m): m is NonNullable<typeof m> =>
          !!m && e.graph.relationshipType(m.edges) === e.graph.INPUT
      );
    const outputs = calculator.output_ids
      .map(findById)
      .filter(
        (m): m is NonNullable<typeof m> =>
          !!m && e.graph.relationshipType(m.edges) !== e.graph.INPUT
      );

    return {
      calculator,
      inputs,
      outputs,
      isPrivate: is_private,
    };
  }
);
