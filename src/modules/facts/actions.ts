import { DEBUG } from "~/lib/constants";
import * as _collections from "~/lib/engine/collections";
import { getVar, selectorSearch, withMissingStats } from "~/lib/engine/facts";
import {
  organizationIdFromFactReadableId,
  organizationReadableId,
} from "~/lib/engine/organization";
import { addStats } from "~/lib/engine/simulation";
import { orArr } from "~/lib/engine/utils";
import { withVariableName } from "~/lib/generateVariableNames/generateFactVariableName";
import { addFact, editFact } from "~/modules/organizations/actions";
import { AppThunk } from "~/modules/store";

import { Simulation } from "../simulations/reducer";

export function getSuggestion(selector): AppThunk {
  return (dispatch, getState) => {
    const { partial, suggestion } = selectorSearch(selector, [
      ...(getState().facts.globalFacts as any),
      ...getState().facts.organizationFacts,
    ]);
    dispatch({
      type: "SUGGEST_FACT",
      suggestion: suggestion.replace(partial, ""),
    });
  };
}

export function clearSuggestion() {
  return { type: "CLEAR_SUGGESTION" };
}

// TODO(matthew): Clean up this interface; right now facts is an array of org containers which are glorified arrays of
// facts.
export function loadByOrg(facts): AppThunk {
  return (dispatch) => {
    dispatch({ type: "LOAD_FACTS_BY_ORG", facts });
  };
}

export function addToOrg(organizationVariableName, fact) {
  return {
    type: "ADD_FACT_TO_ORG",
    organizationVariableName,
    fact: withMissingStats(fact),
  };
}

export function updateWithinOrg(organizationVariableName, fact) {
  return {
    type: "UPDATE_FACT_WITHIN_ORG",
    organizationVariableName,
    fact: withMissingStats(fact),
  };
}

export function deleteFromOrg(organizationVariableName, { id }) {
  return { type: "DELETE_FACT_FROM_ORG", organizationVariableName, id };
}

export function createFactFromMetric(organizationId, metric): AppThunk {
  return (dispatch, getState) => {
    const {
      organizations,
      facts: { organizationFacts },
    } = getState();

    const organization = _collections.get(organizations, organizationId);

    const organizationVariableName = organizationReadableId(organization);
    const otherFacts = orArr(
      _collections.gget(
        organizationFacts,
        organizationVariableName,
        "variable_name",
        "children"
      )
    );
    const existingVariableNames = otherFacts.map(getVar);

    const newFactParams = {
      name: metric.name,
      metric_id: metric.id,
      exported_from_id: metric.space,
      simulation: metric.simulation,
    };

    dispatch(addFact(organization, withVariableName(newFactParams)));
  };
}

export function addSimulationToFact(
  simulation: Simulation,
  id,
  shouldTriggerDownstreamFactSimulations
): AppThunk {
  return (dispatch, getState) => {
    const state = getState();

    const oldOrganizationFact = state.facts.organizationFacts.find((e) =>
      _collections.some(e.children, id)
    );
    if (!oldOrganizationFact) {
      if (DEBUG) {
        console.warn("Tried to add simulations to non-existent fact!", id);
      }
      return;
    }

    const orgId = organizationIdFromFactReadableId(
      oldOrganizationFact.variable_name
    );
    const organization = _collections.get(state.organizations, orgId);

    const oldFact: any = _collections.get(oldOrganizationFact.children, id);

    addStats(simulation);
    const newFact = {
      ...oldFact,
      simulation,
    };

    dispatch(
      editFact(organization, newFact, shouldTriggerDownstreamFactSimulations)
    );
  };
}
