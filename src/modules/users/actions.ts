import _ from "lodash";
import reduxCrud from "redux-crud";

import * as displayErrorsActions from "~/modules/displayErrors/actions";
import * as meActions from "~/modules/me/actions";
import * as userOrganizationMembershipActions from "~/modules/userOrganizationMemberships/actions";

import { AppThunk } from "~/modules/store";
import { captureApiError } from "~/lib/errors/index";
import { ApiUser } from "~/lib/guesstimate_api/resources/Users";
import { api } from "~/lib/guesstimate_api";

const sActions = reduxCrud.actionCreatorsFor("users");

//fetches current user by auth0_id
export function fetchMe(auth0_id: string): AppThunk {
  return async (dispatch, getState) => {
    dispatch(sActions.fetchStart());

    try {
      const data = await api(getState()).users.listWithAuth0Id(auth0_id);
      const me = data.items[0];
      dispatch(meActions.guesstimateMeLoaded(me as any)); // FIXME - casting lies
      dispatch(fetchById(me.id));
    } catch (err) {
      dispatch(displayErrorsActions.newError(err));
      captureApiError("UsersFetch", err, {
        url: "usersFetchError",
      });
    }
  };
}

export function fetchById(userId: number): AppThunk {
  return async (dispatch, getState) => {
    try {
      const user = await api(getState()).users.get({ userId });
      dispatch(fetchSuccess([user]));
      if (getState().me.profile?.id === user.id) {
        dispatch(meActions.guesstimateMeLoaded(user as any)); // FIXME - casting lies
      }
      dispatch(userOrganizationMembershipActions.fetchByUserId(userId));
    } catch (err) {
      dispatch(displayErrorsActions.newError(err));
      captureApiError("UsersFetch", err, {
        url: "fetch",
      });
    }
  };
}

function formatUsers(unformatted: ApiUser[]) {
  return unformatted.map((u) =>
    _.pick(u, ["auth0_id", "needs_tutorial", "id", "name", "picture"])
  );
}

export function fromSearch(spaces): AppThunk {
  return (dispatch) => {
    const users = spaces.map((s) => s.user_info);
    dispatch(fetchSuccess(users));
  };
}

export function fetchSuccess(users: ApiUser[]): AppThunk {
  return (dispatch) => {
    dispatch(sActions.fetchSuccess(formatUsers(_.uniqBy(users, "id"))));
  };
}

export function finishedTutorial(user: ApiUser): AppThunk {
  return (dispatch, getState) => {
    dispatch(sActions.fetchSuccess([{ ...user, needs_tutorial: false }]));
    api(getState()).users.finishedTutorial(user, () => {});
  };
}
