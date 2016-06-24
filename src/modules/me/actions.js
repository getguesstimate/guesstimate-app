import Auth0Lock from 'auth0-lock'

import * as userActions from 'gModules/users/actions.js'
import * as auth0Constants from 'servers/auth0/constants.js'
import * as displayErrorsActions from 'gModules/displayErrors/actions.js'

import {me} from 'gEngine/engine'

import {generalError} from 'lib/errors/index.js'

const lockOptions = {
  disableSignupAction: false,
  disableResetAction: false
}

export const signIn = () => {
    return (dispatch) => lock.showSignin(lockOptions, (err, profile, token) => {
      if (err) {
        generalError('MesignIn Error', {err, profile, token})
      } else {
        const {name, username, picture, user_id} = profile
        dispatch(auth0MeLoaded({name, username, picture, user_id}, token, (new Date()).getTime()))
        dispatch(userActions.fetch({auth0_id: user_id}))
      }
    }
  )
}

export const signUp = () => {
    return (dispatch) => lock.showSignup(lockOptions, (err, profile, token) => {
      if (err) {
        generalError('MesignUp Error', {err, profile, token})
      } else {
        const {nickname, picture, user_id, email, company, name, gender, locale, location} = profile
        dispatch(auth0MeLoaded(profile, token), (new Date()).getTime())
        dispatch(userActions.create(
          {
            name,
            username: nickname,
            email,
            company,
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
      const {id, profile, token, tokenCreationTime} = storage

      if (token) {
        dispatch({ type: 'ALL_OF_ME_RELOADED', id, profile, token})
        const meStorage = me.localStorage.get()

        lock.getProfile(token, (err, profile) => {
          if (err) {
            generalError('MeInit Error', {token, err, profile})
            me.localStorage.clear()
            dispatch({ type: 'DESTROY_ME' })
          } else {
            dispatch(auth0MeLoaded(profile, token, tokenCreationTime))
            const {user_id} = profile
            dispatch(userActions.fetch({auth0_id: user_id}))
          }
        })
      } else {
        me.localStorage.clear()
        dispatch({ type: 'DESTROY_ME' })
      }
    }
  }
}

export function logOut() {
  me.localStorage.clear()
  return { type: 'DESTROY_ME' }
}

function auth0MeLoaded(profile, token, tokenCreationTime) {
  return function(dispatch, getState) {
    dispatch({ type: 'AUTH0_ME_LOADED', profile, token})

    me.localStorage.set({...getState().me, tokenCreationTime})

    const timeLeft = auth0Constants.tokenLifetimeMs - ((new Date()).getTime() - tokenCreationTime)
    if (!!window.tokenTimer) { clearTimeout(window.tokenTimer) }
    window.tokenTimer = setTimeout(() => {dispatch(logOut())}, timeLeft)
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

    const storage = me.localStorage.get()
    me.localStorage.set({...getState().me, tokenCreationTime: _.get(storage, 'tokenCreationTime')})
  }
}

const lock = new Auth0Lock(
  auth0Constants.variables.AUTH0_CLIENT_ID,
  auth0Constants.variables.AUTH0_DOMAIN,
)
