import Auth0Lock from 'auth0-lock'
import {me} from 'gEngine/engine'
import * as userActions from 'gModules/users/actions.js'
import * as auth0Constants from 'servers/auth0/constants.js'

export const signIn = () => {
    return (dispatch, getState) => lock.showSignin({
      disableSignupAction: false,
      disableResetAction: false
    }, (err, profile, token) => {
      if (err) {
        console.log("Error logging in", err)
      } else {
        dispatch(auth0MeLoaded(profile, token))
        const {name, username, picture, user_id} = profile
        dispatch(userActions.fetch({auth0_id: user_id}))
      }
    }
  )
}

export const signUp = () => {
    return (dispatch, getState) => lock.showSignup({
      disableSignupAction: false,
      disableResetAction: false
    }, (err, profile, token) => {
      if (err) {
        console.log("Error logging in", err)
      } else {
        dispatch(auth0MeLoaded(profile, token))
        const {name, username, picture, user_id} = profile
        dispatch(userActions.create({name, username, picture, auth0_id: user_id}))
      }
    }
  )
}

export const init = () => {
  return (dispatch) => {

    const meStorage = me.localStorage.get()
    const token = meStorage && meStorage.token

    if (token) {
      lock.getProfile(token, (err, profile) => {
        if (err) {
          me.localStorage.clear()
        } else {
          dispatch(auth0MeLoaded(profile, token))
          const {name, username, picture, user_id} = profile
          dispatch(userActions.fetch({auth0_id: user_id}))
        }
      })
    }
  }
}

export function updateWithApiId() {
  return { type: 'UpdateWithApiId' };
}

export function logOut() {
  me.localStorage.clear()
  return { type: 'DESTROY_ME' };
}

function auth0MeLoaded(profile, token) {
  return function(dispatch, getState) {
    dispatch({ type: 'AUTH0_ME_LOADED', profile, token});
    me.localStorage.set(getState().me)
  }
}

export function guesstimateMeLoaded(object) {
  return function(dispatch, getState) {
    dispatch({ type: 'GUESSTIMATE_ME_LOADED', id: object.id, profile: object})
    me.localStorage.set(getState().me)
  }
}

const lock = new Auth0Lock(
  auth0Constants.variables.AUTH0_CLIENT_ID,
  auth0Constants.variables.AUTH0_DOMAIN,
);
