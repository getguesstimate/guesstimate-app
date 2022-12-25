import _ from "lodash";
import * as spaceActions from "gModules/spaces/actions";
import * as organizationActions from "gModules/organizations/actions";

import * as e from "gEngine/engine";

import { isWithinRegion } from "lib/locationUtils";

const findSpaceId = (getState, metricId) =>
  e.collections.gget(getState().metrics, metricId, "id", "space");

function registerGraphChange(dispatch, spaceId) {
  spaceId && dispatch(spaceActions.registerGraphChange(spaceId));
}

export function addMetric(item) {
  return (dispatch, getState) => {
    const spaceMetrics = getState().metrics.filter(
      (m) => m.space === item.space
    );
    const existingReadableIds = spaceMetrics.map((m) => m.readableId);
    let newItem = Object.assign({}, item, e.metric.create(existingReadableIds));

    dispatch({ type: "ADD_METRIC", item: newItem });
  };
}

export function removeMetrics(ids) {
  return (dispatch, getState) => {
    if (ids.length === 0) {
      return;
    }

    const spaceId = findSpaceId(getState, ids[0]);

    const {
      organizations,
      spaces,
      facts: { organizationFacts },
    } = getState();
    const organizationId = e.collections.gget(
      spaces,
      spaceId,
      "id",
      "organization_id"
    );
    if (!!organizationId) {
      const organization = e.collections.get(organizations, organizationId);
      const facts = e.organization.findFacts(organizationId, organizationFacts);
      const factsToDelete = _.filter(
        facts,
        (f) => f.exported_from_id === spaceId && ids.includes(f.metric_id)
      );
      factsToDelete.forEach((fact) => {
        dispatch(organizationActions.deleteFact(organization, fact));
      });
    }

    dispatch({ type: "REMOVE_METRICS", item: { ids } });
    registerGraphChange(dispatch, spaceId);
  };
}

export function removeSelectedMetrics(spaceId) {
  return (dispatch, getState) => {
    const state = getState();
    const region = state.selectedRegion;
    const metrics = state.metrics.filter(
      (m) => m.space === spaceId && isWithinRegion(m.location, region)
    );
    dispatch(removeMetrics(metrics.map((m) => m.id)));
  };
}

export function changeMetric(item) {
  return (dispatch, getState) => {
    dispatch({ type: "CHANGE_METRIC", item });
    registerGraphChange(dispatch, findSpaceId(getState, item.id));
  };
}
