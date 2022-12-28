import _ from "lodash";
import { actionCreatorsFor } from "redux-crud";

import cuid from "cuid";

import * as displayErrorsActions from "gModules/displayErrors/actions";
import * as meActions from "gModules/me/actions";
import * as userOrganizationMembershipActions from "gModules/userOrganizationMemberships/actions";

import { setupGuesstimateApi } from "servers/guesstimate-api/constants";

import { captureApiError, generalError } from "lib/errors/index";
import { AppThunk } from "gModules/store";

let sActions = actionCreatorsFor("users");

function api(state) {
  function getToken(state) {
    return _.get(state, "me.token");
  }
  return setupGuesstimateApi(getToken(state));
}

//fetches a specific user if auth0_id is passed in
export function fetch({ auth0_id }): AppThunk {
  return (dispatch, getState) => {
    dispatch(sActions.fetchStart());

    api(getState()).users.listWithAuth0Id(auth0_id, (err, data) => {
      if (err) {
        dispatch(displayErrorsActions.newError(err));
        captureApiError("UsersFetch", err, {
          url: "usersFetchError",
        });
      } else if (data) {
        const me = data.items[0];
        dispatch(meActions.guesstimateMeLoaded(me));
        dispatch(fetchById(me.id));
      }
    });
  };
}

export function fetchById(userId): AppThunk {
  return (dispatch, getState) => {
    api(getState()).users.get({ userId }, (err, user) => {
      if (err) {
        dispatch(displayErrorsActions.newError(err));
        captureApiError("UsersFetch", err, {
          url: "fetch",
        });
      } else if (user) {
        dispatch(fetchSuccess([user]));
        if (getState().me.id === user.id) {
          dispatch(meActions.guesstimateMeLoaded(user));
        }
        dispatch(userOrganizationMembershipActions.fetchByUserId(userId));
      }
    });
  };
}

function formatUsers(unformatted) {
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

export function create(object): AppThunk {
  return (dispatch, getState) => {
    const newUser = Object.assign({}, object, { id: cuid() });
    dispatch(sActions.createStart(newUser));

    api(getState()).users.create(newUser, (err, user) => {
      if (err) {
        dispatch(displayErrorsActions.newError());
        captureApiError("UsersCreate", err, {
          url: "create",
        });
      } else if (_.isEmpty(user)) {
        generalError("UserCreate-EmptyResponse", {
          cid: newUser.id,
          url: "userscreate",
        });
        dispatch(sActions.fetchSuccess([user]));
        dispatch(displayErrorsActions.newError());
      } else {
        dispatch(sActions.createSuccess(user, newUser.id));
        dispatch(meActions.guesstimateMeLoaded(user));
      }
    });
  };
}

export function fetchSuccess(users): AppThunk {
  return (dispatch) => {
    dispatch(sActions.fetchSuccess(formatUsers(_.uniqBy(users, "id"))));
  };
}

export function finishedTutorial(user): AppThunk {
  return (dispatch, getState) => {
    dispatch(sActions.fetchSuccess([{ ...user, needs_tutorial: false }]));
    api(getState()).users.finishedTutorial(user, () => {});
  };
}
