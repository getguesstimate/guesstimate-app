import auth0 from "auth0-js";
import { BASE_URL } from "~/lib/constants";

import * as userActions from "~/modules/users/actions";
import * as auth0Constants from "~/server/auth0/constants";

import { me } from "~/lib/engine/engine";
import { generalError } from "~/lib/errors/index";
import { ApiUser } from "~/lib/guesstimate_api/resources/Users";
import { AppThunk } from "~/modules/store";
import { meSlice } from "./slice";

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
  return (dispatch, getState) => {
    if (!/access_token|id_token|error/.test(hash)) {
      return;
    }
    webAuth.parseHash({ hash }, (err, authResult) => {
      if (err || !authResult?.idToken) {
        generalError("parseHash Error", { err }); // TODO - dispatch redux error?
        return;
      }

      // should we use bits of auth0 profile here until we load the user from guesstimate?
      dispatch(
        meSlice.actions.setToken({
          token: authResult.idToken,
        })
      );
      me.localStorage.set({ ...getState().me });

      dispatch(userActions.fetchMe(authResult.idTokenPayload.sub));
    });
  };
}

export function logOut() {
  me.localStorage.clear();
  return meSlice.actions.destroy();
}

export function init(): AppThunk {
  return (dispatch) => {
    const storage = me.localStorage.get();
    if (storage) {
      const { profile, token } = storage;

      // TODO - is this always true? i.e. can we have data in storage but no token?
      if (token) {
        dispatch(meSlice.actions.init({ profile, token }));
        dispatch(userActions.fetchMe(profile.auth0_id));
      }
    }
  };
}

export function guesstimateMeReload(): AppThunk {
  return (dispatch, getState) => {
    const user_id = getState().me.profile?.id;
    if (user_id) {
      dispatch(userActions.fetchById(user_id));
    }
  };
}

// called from users actions when current user is fetched
export function guesstimateMeLoaded(object: ApiUser): AppThunk {
  return (dispatch, getState) => {
    dispatch(meSlice.actions.setProfile({ profile: object }));

    me.localStorage.set({
      ...getState().me,
    });
  };
}
