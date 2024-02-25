import { me } from "~/lib/engine/engine";
import { AppThunk } from "~/modules/store";
import * as userActions from "~/modules/users/actions";

import { MeProfile, meSlice } from "./slice";

export function logInWithAccessToken({
  sub,
  id_token,
}: {
  sub: string;
  id_token: string;
}): AppThunk {
  return (dispatch) => {
    // should we use bits of auth0 profile here until we load the user from guesstimate?
    const authInfo = {
      token: id_token,
      auth0_id: sub,
    };
    dispatch(meSlice.actions.setAuth0(authInfo));
    me.localStorage.set(authInfo);

    dispatch(userActions.fetchMe(sub));
  };
}

export function logOut(): AppThunk {
  return (dispatch) => {
    me.localStorage.clear();
    dispatch(meSlice.actions.destroy());
  };
}

// Should be called once on page load.
// Loads profile and auth token from localStorage and refetches the user data.
export function init(): AppThunk {
  return (dispatch) => {
    const authInfo = me.localStorage.get();
    if (authInfo) {
      dispatch(meSlice.actions.setAuth0(authInfo));
      dispatch(userActions.fetchMe(authInfo.auth0_id));
    }
  };
}

export function guesstimateMeReload(): AppThunk {
  return (dispatch, getState) => {
    const state = getState().me;
    if (state.tag === "SIGNED_OUT") {
      return;
    }
    dispatch(userActions.fetchMe(state.auth0_id));
  };
}

// called from users actions when current user is fetched
export function guesstimateMeLoaded(profile: MeProfile): AppThunk {
  return (dispatch) => {
    dispatch(meSlice.actions.setProfile({ profile }));
  };
}
