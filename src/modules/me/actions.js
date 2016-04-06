import Auth0Lock from 'auth0-lock'
import {me} from 'gEngine/engine'
import * as userActions from 'gModules/users/actions.js'
import * as auth0Constants from 'servers/auth0/constants.js'
import {generalError} from 'lib/errors/index.js'
import * as displayErrorsActions from 'gModules/displayErrors/actions.js'

const lockOptions = {
  disableSignupAction: false,
  disableResetAction: false
}

export const signIn = () => {
    return (dispatch) => lock.showSignin(lockOptions, (err, profile, token) => {
      if (err) {
        generalError('MesignIn Error', {err, profile, token})
        dispatch(displayErrorsActions.newError())
      } else {
        const {name, username, picture, user_id} = profile
        dispatch(auth0MeLoaded({name, username, picture, user_id}, token))
        dispatch(userActions.fetch({auth0_id: user_id}))
      }
    }
  )
}

export const signUp = () => {
    return (dispatch) => lock.showSignin(lockOptions, (err, profile, token) => {
      if (err) {
        generalError('MesignUp Error', {err, profile, token})
        dispatch(displayErrorsActions.newError())
      } else {
        dispatch(auth0MeLoaded(profile, token))
        const {nickname, picture, user_id, email, job_title, name, gender, locale, location} = profile
        dispatch(userActions.create(
          {
            name,
            username: nickname,
            email,
            job_title,
            locale,
            location,
            gender,
            picture,
            auth0_id: user_id
          }))
      }
    }
  )
}

export const init = () => {
  return (dispatch) => {
    const storage = me.localStorage.get()
    if (storage) {
      const {id, profile, token} = storage
      dispatch({ type: 'ALL_OF_ME_RELOADED', id, profile, token})

      const meStorage = me.localStorage.get()

      if (token) {
        lock.getProfile(token, (err, profile) => {
          if (err) {
            generalError('MeInit Error', {token, err, profile})
            me.localStorage.clear()
            dispatch({ type: 'DESTROY_ME' })
          } else {
            dispatch(auth0MeLoaded(profile, token))
            const {user_id} = profile
            dispatch(userActions.fetch({auth0_id: user_id}))
          }
        })
      }
    }
  }
}

export function logOut() {
  me.localStorage.clear()
  return { type: 'DESTROY_ME' };
}

function auth0MeLoaded(profile, token) {
  return function(dispatch, getState) {
    dispatch({ type: 'AUTH0_ME_LOADED', profile, token});
    const {name, username, picture, user_id} = profile
    const saveAs = {token, profile: {name, username, picture, user_id}}
    me.localStorage.set(getState().me)
  }
}

export function guesstimateMeLoad() {
  return function(dispatch, getState) {
    const user_id = _.get(getState(), 'me.id')
    if (user_id) {
      dispatch(userActions.fetchById(user_id))
    }
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
