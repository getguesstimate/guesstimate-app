import {actionCreatorsFor} from 'redux-crud';
import $ from 'jquery'
import cuid from 'cuid'
import * as meActions from 'gModules/me/actions.js'
import * as displayErrorsActions from 'gModules/displayErrors/actions.js'
import {rootUrl} from 'servers/guesstimate-api/constants.js'
import {captureApiError, generalError} from 'lib/errors/index.js'

let standardActionCreators = actionCreatorsFor('users');

const standards = () => {
  return {
    dataType: 'json',
    contentType: 'application/json'
  }
}

const formattedRequest = ({requestParams, state}) => {
  const params = Object.assign(standards(state), requestParams)
  return $.ajax(params)
}

//either fetches all users or the specific user if auth0_id is passed in
export function fetch(params = {}) {
  return function(dispatch, getState) {
    const action = standardActionCreators.fetchStart();
    dispatch(action)

    let url = rootUrl + 'users'
    params.auth0_id ? url += `?auth0_id=${params.auth0_id}` : false

    const request = formattedRequest({
      state: getState(),
      requestParams: {
        url,
        method: 'GET',
      }
    })

    request.done(data => {
      const action = standardActionCreators.fetchSuccess(data)
      dispatch(action)

      if (params.auth0_id) {
        if (_.isEmpty(data)){
          generalError('UserFetch-EmptyResponse', {params, url})
          dispatch(displayErrorsActions.newError())
        } else {
          const me = data[0]
          dispatch(meActions.guesstimateMeLoaded(me))
        }
      }
    })

    request.fail((jqXHR, textStatus, errorThrown) => {
      dispatch(displayErrorsActions.newError())
      captureApiError('UsersFetch', jqXHR, textStatus, errorThrown, {url})
    })
  }
}

export function fetchById(id) {
  const url = (rootUrl + 'users/' + id)

  return function(dispatch, getState) {
    const action = standardActionCreators.fetchStart();
    dispatch(action)

    const request = formattedRequest({
      state: getState(),
      requestParams: {
        url,
        method: 'GET',
      }
    })

    request.done(data => {
      const action = standardActionCreators.fetchSuccess(data)
      dispatch(action)

    })

    request.fail((jqXHR, textStatus, errorThrown) => {
      dispatch(displayErrorsActions.newError())
      captureApiError('UsersFetch', jqXHR, textStatus, errorThrown, {url})
    })
  }
}

export function fromSearch(spaces) {
  return function(dispatch) {
    const users = spaces.map(s => s.user_info)
    const formatted = users.map(d => _.pick(d, ['auth0_id', 'id', 'name', 'picture']))
    const action = standardActionCreators.fetchSuccess(formatted)
    dispatch(action)
  }
}

export function create(object) {
  return function(dispatch, getState) {

    const cid = cuid()
    object = Object.assign(object, {id: cid})
    const action = standardActionCreators.createStart(object);

    const url = rootUrl + 'users/'
    const requestParams = {
      url,
      data: JSON.stringify({user: object}),
      method: 'POST'
    }
    const request = formattedRequest({
      state: getState(),
      requestParams
    })

    request.done(data => {
        if (_.isEmpty(data)){
          generalError('UserCreate-EmptyResponse', {cid, url})
          dispatch(displayErrorsActions.newError())
        } else {
          const action = standardActionCreators.createSuccess(data, cid)
          dispatch(action)
          dispatch(meActions.guesstimateMeLoaded(data))
        }
    })

    request.fail((jqXHR, textStatus, errorThrown) => {
      dispatch(displayErrorsActions.newError())
      captureApiError('UsersCreate', jqXHR, textStatus, errorThrown, {url})
    })
  }
}

