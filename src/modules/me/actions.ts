import auth0 from "auth0-js";
import { BASE_URL } from "~/lib/constants";

import * as userActions from "~/modules/users/actions";
import * as auth0Constants from "~/server/auth0/constants";

import { me } from "~/lib/engine/engine";
import { generalError } from "~/lib/errors/index";
import { AppThunk } from "~/modules/store";
import { MeProfile, meSlice } from "./slice";

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

export function logInWithHash(hash: string): AppThunk {
  return (dispatch) => {
    if (!/access_token|id_token|error/.test(hash)) {
      return;
    }
    webAuth.parseHash({ hash }, (err, authResult) => {
      if (err || !authResult?.idToken) {
        generalError("parseHash Error", { err }); // TODO - dispatch redux error?
        return;
      }

      // should we use bits of auth0 profile here until we load the user from guesstimate?
      const authInfo = {
        token: authResult.idToken,
        auth0_id: authResult.idTokenPayload.sub,
      };
      dispatch(meSlice.actions.setAuth0(authInfo));
      me.localStorage.set(authInfo);

      dispatch(userActions.fetchMe(authResult.idTokenPayload.sub));
    });
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
