import auth0 from "auth0-js";
import { BASE_URL } from "~/lib/constants";

import * as userActions from "~/modules/users/actions";
import * as auth0Constants from "~/server/auth0/constants";

import { me } from "~/lib/engine/engine";
import { generalError } from "~/lib/errors/index";
import { AppThunk } from "~/modules/store";
import { MeProfile, meSlice } from "./slice";
import { IdToken } from "@auth0/auth0-react";

const webAuth = new auth0.WebAuth({
  domain: auth0Constants.variables.AUTH0_DOMAIN,
  clientID: auth0Constants.variables.AUTH0_CLIENT_ID,
  redirectUri: `${BASE_URL}/auth-redirect`,
  audience: `https://${auth0Constants.variables.AUTH0_DOMAIN}/userinfo`,
  responseType: "token id_token",
  scope: "openid",
});

export function signIn() {
  webAuth.authorize({ mode: "login" });
}

export function signUp() {
  webAuth.authorize({ mode: "signUp" });
}

export function logInWithIdToken(token: IdToken): AppThunk {
  return (dispatch) => {
    // should we use bits of auth0 profile here until we load the user from guesstimate?
    const authInfo = {
      token: token.__raw,
      auth0_id: token.sub,
    };
    dispatch(meSlice.actions.setAuth0(authInfo));
    me.localStorage.set(authInfo);

    dispatch(userActions.fetchMe(token.sub));
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
