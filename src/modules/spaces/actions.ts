import _ from "lodash";
import { actionCreatorsFor } from "redux-crud";

import cuid from "cuid";

import * as calculatorActions from "gModules/calculators/actions";
import { changeActionState } from "gModules/canvas_state/actions";
import { initSpace, saveCheckpoint } from "gModules/checkpoints/actions";
import * as organizationActions from "gModules/organizations/actions";
import * as userActions from "gModules/users/actions";

import * as e from "gEngine/engine";

import { AppThunk, RootState } from "gModules/store";
import { api } from "lib/guesstimate_api";
import { ApiSpace } from "lib/guesstimate_api/resources/Models";
import { ApiUser } from "lib/guesstimate_api/resources/Users";
import { NextRouter } from "next/router";

const sActions = actionCreatorsFor("spaces");

export function fetchSuccess(spaces: ApiSpace[]): AppThunk {
  return (dispatch, getState) => {
    const users = spaces
      .map((s) => _.get(s, "_embedded.user"))
      .filter((u): u is ApiUser => !!u);
    const organizations = spaces
      .map((s) => {
        const organization = _.get(s, "_embedded.organization");
        if (!e.utils.isPresent(organization)) {
          return null;
        }
        return {
          ...organization,
          fullyLoaded: true,
          facts: [
            ...e.utils.orArr(_.get(organization, "facts")),
            ...e.utils.orArr(_.get(s, "_embedded.imported_facts")),
          ],
        };
      })
      .filter(e.utils.isPresent);
    const calculators = _.flatten(
      spaces.map((s) => e.utils.orArr(_.get(s, "_embedded.calculators")))
    ).filter(e.utils.isPresent);

    if (!_.isEmpty(calculators)) {
      dispatch(calculatorActions.sActions.fetchSuccess(calculators));
    }
    if (!_.isEmpty(organizations)) {
      dispatch(organizationActions.fetchSuccess(organizations));
    }
    if (!_.isEmpty(users)) {
      dispatch(userActions.fetchSuccess(users));
    }

    spaces.forEach(({ id, graph }) => {
      // We need to check if the space is already initialized as we do not want to double-initialize a space.
      const isInitialized = e.collections.some(
        getState().checkpoints,
        id,
        "spaceId"
      );
      if (!isInitialized) {
        dispatch(initSpace(id, graph));
      }
    });

    dispatch(
      sActions.fetchSuccess(spaces.map((s) => _.omit(s, ["_embedded"])))
    );
  };
}

export function destroy(object: ApiSpace, router: NextRouter): AppThunk {
  const id = object.id;
  return async (dispatch, getState) => {
    const navigateTo = !!object.organization_id
      ? e.organization.urlById(object.organization_id)
      : e.user.urlById(object.user_id!);

    router.push(navigateTo);

    dispatch(sActions.deleteStart({ id }));

    await api(getState()).models.destroy(id);
    dispatch(sActions.deleteSuccess({ id }));
  };
}

// TODO(matthew): Maybe we can remove metric_count?
const SPACE_INDEX_ATTRIBUTES = [
  "id",
  "name",
  "description",
  "user_id",
  "organization_id",
  "updated_at",
  "metric_count",
  "is_private",
  "screenshot",
  "big_screenshot",
  "viewcount",
  "imported_fact_ids",
  "exported_facts_count",
  "editors_by_time",
];

export function fromSearch(data): AppThunk {
  return (dispatch) => {
    const formatted = data.map((d) => _.pick(d, SPACE_INDEX_ATTRIBUTES));
    const action = sActions.fetchSuccess(formatted);
    dispatch(action);
  };
}

export function fetchById(
  spaceId: number,
  shareableLinkToken: string | null = null
): AppThunk {
  return async (dispatch, getState) => {
    dispatch(sActions.fetchStart());

    const value = await api(getState()).models.get(spaceId, shareableLinkToken);
    dispatch(fetchSuccess([value]));
  };
}

export const fetch = (
  args: { userId: number } | { organizationId: string }
): AppThunk => {
  return async (dispatch, getState) => {
    dispatch(sActions.fetchStart());
    const value = await api(getState()).models.list(args);
    const formatted = value.items.map((d) => _.pick(d, SPACE_INDEX_ATTRIBUTES));
    dispatch(sActions.fetchSuccess(formatted));

    const users = value.items
      .map((d) => d._embedded?.user)
      .filter((u): u is ApiUser => !!u);
    dispatch(userActions.fetchSuccess(users));
  };
};

export function create(
  organizationId,
  params: any = {},
  router: NextRouter
): AppThunk {
  return async (dispatch, getState) => {
    const cid = cuid();
    let object = { ...params, id: cid };
    if (organizationId) {
      object.organization_id = organizationId;
    }

    dispatch(changeActionState("CREATING"));
    // const action = sActions.createStart(object);

    try {
      const value = await api(getState()).models.create(object);
      dispatch(changeActionState("CREATED"));
      dispatch(sActions.createSuccess(value, cid));
      dispatch(initSpace(value.id, { metrics: [], guesstimates: [] }));
      router.push(`/models/${value.id}`);
    } catch (err) {
      dispatch(changeActionState("ERROR_CREATING"));
    }
  };
}

export function copy(spaceId: number, router: NextRouter): AppThunk {
  return async (dispatch, getState) => {
    dispatch(changeActionState("COPYING"));

    const cid = cuid();
    // const action = sActions.createStart({ id: cid });

    try {
      const value = await api(getState()).models.copy(spaceId);
      dispatch(changeActionState("COPIED"));
      // Signal the resource was created.
      dispatch(sActions.createSuccess(value, cid));
      // And that we've fetched new data from it. We have to do this in this case as the new resource is pre-populated
      // with some data.
      dispatch(fetchSuccess([value]));

      router.push(`/models/${value.id}`);
    } catch (err) {
      dispatch(changeActionState("ERROR_COPYING"));
    }
  };
}

function getSpace(getState: () => RootState, spaceId: number) {
  const { spaces } = getState();
  return e.collections.get(spaces, spaceId);
}

export function generalUpdate(spaceId: number, params): AppThunk {
  return async (dispatch, getState) => {
    const space = { ...getSpace(getState, spaceId), ...params };
    const usesFacts =
      _.has(space, "graph.guesstimates") &&
      _.some(
        space.graph.guesstimates,
        (g) =>
          !!_.get(g, "expression") &&
          g.expression.includes(e.simulation.FACT_ID_PREFIX)
      );
    const isPrivate = space.is_private;
    if (!isPrivate && usesFacts) {
      dispatch(changeActionState("ERROR"));
      return;
    }

    dispatch(sActions.updateStart(space));
    dispatch(changeActionState("SAVING"));

    const updateMsg = { ...params, previous_updated_at: space.updated_at };
    try {
      const value = await api(getState()).models.update(spaceId, updateMsg);
      dispatch(sActions.updateSuccess(value));
      dispatch(changeActionState("SAVED"));
    } catch (err) {
      if ((err as any) === "Conflict") {
        // TODO - will never happen?
        dispatch(changeActionState("CONFLICT"));
      } else {
        dispatch(changeActionState("ERROR"));
      }
    }
  };
}

//updates everything except graph
export function update(spaceId: number, params = {}): AppThunk {
  return (dispatch, getState) => {
    let space = getSpace(getState, spaceId);
    space = Object.assign({}, space, params);
    const updates = _.pick(space, ["name", "description"]);

    dispatch(generalUpdate(spaceId, updates));
  };
}

//updates graph only
export function updateGraph(spaceId: number, saveOnServer = true): AppThunk {
  return (dispatch, getState) => {
    let {
      spaces,
      metrics,
      guesstimates,
      canvasState: { actionState },
    } = getState();
    let space: any = e.collections.get(spaces, spaceId); // FIXME - can be undefined
    space = e.space.withGraph(space, { metrics, guesstimates });
    space.graph = _.omit(space.graph, "simulations");
    const updates = { graph: space.graph };

    dispatch(saveCheckpoint(spaceId, space.graph));
    if (saveOnServer) {
      dispatch(generalUpdate(spaceId, updates));
    } else if (actionState !== "UNALLOWED_ATTEMPT") {
      dispatch(changeActionState("UNALLOWED_ATTEMPT"));
    }
  };
}

function meCanEdit(spaceId: number, state: RootState): boolean {
  const { spaces, me, userOrganizationMemberships, canvasState } = state;
  const space = e.collections.get(spaces, spaceId);
  return space
    ? e.space.canEdit(space, me, userOrganizationMemberships, canvasState)
    : false;
}

export function registerGraphChange(spaceId: number): AppThunk {
  return (dispatch, getState) => {
    const canEdit = meCanEdit(spaceId, getState());
    dispatch(updateGraph(spaceId, canEdit));
  };
}

export function enableShareableLink(spaceId: number): AppThunk {
  return async (dispatch, getState) => {
    const value = await api(getState()).models.enableShareableLink(spaceId);
    dispatch(sActions.updateSuccess(value));
  };
}

export function disableShareableLink(spaceId: number): AppThunk {
  return async (dispatch, getState) => {
    const value = await api(getState()).models.disableShareableLink(spaceId);
    dispatch(sActions.updateSuccess(value));
  };
}

export function rotateShareableLink(spaceId: number): AppThunk {
  return async (dispatch, getState) => {
    const value = await api(getState()).models.rotateShareableLink(spaceId);
    dispatch(sActions.updateSuccess(value));
  };
}
