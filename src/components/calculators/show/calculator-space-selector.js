import { createSelector } from "reselect";
import * as e from "gEngine/engine";

const _sameId = (idA, idB) => idA.toString() === idB.toString();
const spaceGraphSelector = (state) =>
  _.pick(state, [
    "spaces",
    "metrics",
    "guesstimates",
    "simulations",
    "users",
    "me",
    "organizations",
  ]);
const organizationFactsSelector = (state) =>
  _.get(state, "facts.organizationFacts");
const calculatorSelector = (state, { calculatorId }) =>
  state.calculators.find((c) => _sameId(c.id, calculatorId));

export const calculatorSpaceSelector = createSelector(
  spaceGraphSelector,
  organizationFactsSelector,
  calculatorSelector,
  (graph, organizationFacts, calculator) => {
    if (!_.has(calculator, "space_id")) {
      return {};
    }
    const { metrics, is_private } = e.space.toDSpace(
      calculator.space_id,
      graph,
      organizationFacts
    );

    const findById = (id) => metrics.find((m) => _sameId(m.id, id));

    const inputs = calculator.input_ids
      .map(findById)
      .filter(
        (m) => !!m && e.graph.relationshipType(m.edges) === e.graph.INPUT
      );
    const outputs = calculator.output_ids
      .map(findById)
      .filter(
        (m) => !!m && e.graph.relationshipType(m.edges) !== e.graph.INPUT
      );

    return {
      calculator,
      inputs,
      outputs,
      isPrivate: is_private,
    };
  }
);
