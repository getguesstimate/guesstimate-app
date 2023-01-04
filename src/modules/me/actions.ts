import _ from "lodash";
import auth0 from "auth0-js";
import { BASE_URL } from "lib/constants";

import * as userActions from "gModules/users/actions";
import * as auth0Constants from "servers/auth0/constants";

import { generalError } from "lib/errors/index";
import { me } from "gEngine/engine";
import { AppDispatch, AppThunk } from "gModules/store";

class WebAuth {
  auth: auth0.WebAuth;

  constructor() {
    this.auth = new auth0.WebAuth({
      domain: auth0Constants.variables.AUTH0_DOMAIN,
      clientID: auth0Constants.variables.AUTH0_CLIENT_ID,
      redirectUri: `${BASE_URL}/auth-redirect`,
      audience: `https://${auth0Constants.variables.AUTH0_DOMAIN}/userinfo`,
      responseType: "token id_token",
      scope: "openid",
    });
  }

  signIn() {
    this.auth.authorize({ mode: "login" });
  }

  signUp() {
    this.auth.authorize({ mode: "signUp" });
  }

  parseHashFromUrl(dispatch: AppDispatch) {
    if (/access_token|id_token|error/.test(location.hash)) {
      this.auth.parseHash({ hash: location.hash }, (err, authResult) => {
        if (!err && authResult) {
          dispatch(
            auth0MeLoaded(
              {
                // user_id: authResult.idTokenPayload.sub,
              },
              authResult.idToken!,
              new Date().getTime()
            )
          );
          dispatch(
            userActions.fetch({ auth0_id: authResult.idTokenPayload.sub })
          );
        } else {
          generalError("parseHash Error", { err });
        }
      });
    }
  }
}

export function signIn() {
  const auth = new WebAuth();
  auth.signIn();
}

export function signUp() {
  const auth = new WebAuth();
  auth.signUp();
}

export function logIn(): AppThunk {
  const auth = new WebAuth();
  return (dispatch) => {
    auth.parseHashFromUrl(dispatch);
  };
}

export function init(): AppThunk {
  return (dispatch) => {
    const storage = me.localStorage.get();
    if (storage) {
      const { id, profile, token, tokenCreationTime } = storage;

      if (token) {
        dispatch({ type: "ALL_OF_ME_RELOADED", id, profile, token });
        dispatch(auth0MeLoaded(profile, token, tokenCreationTime));
        dispatch(userActions.fetch({ auth0_id: profile.auth0_id }));
      } else {
        dispatch(logOut());
      }
    }
  };
}

export function logOut() {
  me.localStorage.clear();
  return { type: "DESTROY_ME" };
}

function auth0MeLoaded(
  profile,
  token: string,
  tokenCreationTime: number
): AppThunk {
  return (dispatch, getState) => {
    dispatch({ type: "AUTH0_ME_LOADED", profile, token });

    me.localStorage.set({ ...getState().me, tokenCreationTime });

    const timeLeft =
      auth0Constants.tokenLifetimeMs -
      (new Date().getTime() - tokenCreationTime);
    if (timeLeft < 1) {
      dispatch(logOut());
    }
    if (!!(window as any).tokenTimer) {
      clearTimeout((window as any).tokenTimer);
    }
    (window as any).tokenTimer = setTimeout(() => {
      dispatch(logOut());
    }, timeLeft);
  };
}

export function guesstimateMeReload(): AppThunk {
  return (dispatch, getState) => {
    const user_id = getState().me.id;
    if (user_id) {
      dispatch(userActions.fetchById(user_id));
    }
  };
}

export function guesstimateMeLoaded(object): AppThunk {
  return (dispatch, getState) => {
    dispatch({ type: "GUESSTIMATE_ME_LOADED", id: object.id, profile: object });

    const storage = me.localStorage.get();
    me.localStorage.set({
      ...getState().me,
      tokenCreationTime: _.get(storage, "tokenCreationTime"),
    });
  };
}
