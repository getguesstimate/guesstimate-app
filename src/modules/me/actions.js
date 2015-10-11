import Auth0Lock from 'auth0-lock'
import {me} from 'gEngine/engine'

const signXCallback = (dispatch) => (err, profile, token) => {
  if (err) {
    console.log("Error logging in", err)
  } else {
    dispatch(createMe(profile, token))
  }
}

const signXlockAction = () => {
  return () => {
    return (dispatch) => lock['showSignin'](signXCallback(dispatch))
  }
}
export const signIn = signXlockAction('showSignin')
export const signUp = signXlockAction('showSignup')

export const init = () => {
  return (dispatch) => {

    const meStorage = me.localStorage.get()
    const token = meStorage && meStorage.token

    if (token) {
      lock.getProfile(token, (err, profile) => {
        if (err) {
          me.localStorage.clear()
          console.log("Existing storage key no longer in service", err)
        } else {
          dispatch(createMe(profile, token))
        }
      })
    }
  }
}
export function logOut() {
  me.localStorage.clear()
  return { type: 'DESTROY_ME' };
}

function createMe(profile, token) {
  return function(dispatch, getState) {
    dispatch({ type: 'CREATE_ME', object: {profile, token}});
    me.localStorage.set({token: getState().me.token})
  }
}
const Auth0Variables = {
  AUTH0_CLIENT_ID: 'By2xEUCPuGqeJZqAFMpBlgHRqpCZelj0',
  AUTH0_DOMAIN: 'guesstimate.auth0.com'
};

const lock = new Auth0Lock(
  Auth0Variables.AUTH0_CLIENT_ID,
  Auth0Variables.AUTH0_DOMAIN
);
