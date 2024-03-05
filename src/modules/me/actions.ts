import { Session } from "next-auth";
import { AppThunk } from "~/modules/store";
import * as userActions from "~/modules/users/actions";

import { MeProfile, meSlice } from "./slice";

// Should be called once on session changes and on initial page load.
export function setSession(session: Session | null): AppThunk {
  return (dispatch, getState) => {
    // should we use bits of auth0 profile here until we load the user from guesstimate?
    if (session && session.auth0_id) {
      dispatch(meSlice.actions.setSession(session));

      // next-auth refreshes the session, so we call `fetchMe` only if profile is not loaded yet
      if (!getState().me.profile) {
        dispatch(userActions.fetchMe(session.auth0_id));
      }
    } else {
      dispatch(meSlice.actions.destroy());
    }
  };
}

export function guesstimateMeReload(): AppThunk {
  return (dispatch, getState) => {
    const state = getState().me;
    if (!state.session?.auth0_id) {
      return;
    }
    dispatch(userActions.fetchMe(state.session.auth0_id));
  };
}

// called from users actions when current user is fetched
export function guesstimateMeLoaded(profile: MeProfile): AppThunk {
  return (dispatch) => {
    dispatch(meSlice.actions.setProfile({ profile }));
  };
}
