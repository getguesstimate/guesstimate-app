import {actionCreatorsFor} from 'redux-crud';
import $ from 'jquery'
import cuid from 'cuid'
import e from 'gEngine/engine'
import _ from 'lodash'
import app from 'ampersand-app'
import {rootUrl} from 'servers/guesstimate-api/constants.js'
import {captureApiError} from 'lib/errors/index.js'
import {changeSaveState} from 'gModules/canvas_state/actions.js'
import * as userActions from 'gModules/users/actions.js'

let standardActionCreators = actionCreatorsFor('spaces');


const standards = (state) => {
  return {
    headers: { 'Authorization': 'Bearer ' + state.me.token },
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json'
  }
}

const formattedRequest = ({requestParams, state}) => {
  const params = Object.assign(standards(state), requestParams)
  return $.ajax(params)
}

export function destroy(object) {
  const id = object.id;
  return function(dispatch, getState) {
    app.router.history.navigate('/models')
    const action = standardActionCreators.deleteStart({id: id});
    dispatch(action)

    const request = formattedRequest({
      state: getState(),
      requestParams: {
        url: (rootUrl + 'spaces/' + id),
        method: 'DELETE'
      }
    })


    request.done(() => {
      const successAction = standardActionCreators.deleteSuccess({id: id});
      dispatch(successAction)
    })

    request.fail((jqXHR, textStatus, errorThrown) => {
      captureApiError('SpacesDestroy', jqXHR, textStatus, errorThrown, {url: (rootUrl + 'spaces/' + id)})
    })
  }
}

export function fromSearch(data) {
  return function(dispatch) {
    const formatted = data.map(d => _.pick(d, ['id', 'name', 'description', 'user_id', 'updated_at', 'metric_count']))
    const action = standardActionCreators.fetchSuccess(formatted)
    dispatch(action)
  }
}

export function fetchById(id) {
  const url = (rootUrl + 'spaces/' + id)

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

    request.done(space => {
      const action = standardActionCreators.fetchSuccess([space])
      dispatch(action)

      const users = getState().users
      const user_id = space.user_id
      const has_user = !!(users.find(e => e.id === user_id))
      if (!has_user) { dispatch(userActions.fetchById(user_id)) }
    })

    request.fail((jqXHR, textStatus, errorThrown) => {
      captureApiError('SpacesFetch', jqXHR, textStatus, errorThrown, {url})
    })
  }
}

export function create(object) {
  return function(dispatch, getState) {
    dispatch({ type: 'redux-form/START_SUBMIT', form: 'contact' })

    const cid = cuid()
    object = Object.assign(object, {id: cid})
    const action = standardActionCreators.createStart(object);

    const request = formattedRequest({
      state: getState(),
      requestParams: {
        url: (rootUrl + 'spaces/'),
        data: JSON.stringify({space: object}),
        method: 'POST'
      }
    })

    request.done(data => {
      const action = standardActionCreators.createSuccess(data, cid)
      dispatch(action)
      app.router.history.navigate('/models/' + data.id)
    })
    request.fail((jqXHR, textStatus, errorThrown) => {
      captureApiError('SpacesCreate', jqXHR, textStatus, errorThrown, {url: (rootUrl+'spaces')})
    })
  }
}

function getSpace(getState, spaceId) {
  let {spaces, metrics, guesstimates} = getState();
  return e.space.get(spaces, spaceId)
}

export function generalUpdate(spaceId, params) {
  return function(dispatch, getState) {

    const space = Object.assign({}, getSpace(getState, spaceId), params)
    const action = standardActionCreators.updateStart(space);

    dispatch(action)
    dispatch(changeSaveState('SAVING'))

    const request = formattedRequest({
      state: getState(),
      requestParams: {
        url: (rootUrl + 'spaces/' + spaceId),
        method: 'PATCH',
        data: JSON.stringify({space: params})
      }
    })

    request.done((data) => {
      const action = standardActionCreators.updateSuccess(data)
      dispatch(action)
      dispatch(changeSaveState('SAVED'))
    })
    request.fail((jqXHR, textStatus, errorThrown) => {
      captureApiError('SpacesUpdate', jqXHR, textStatus, errorThrown, {url: (rootUrl + 'spaces/' + spaceId)})
      dispatch(changeSaveState('ERROR'))
    })
  }
}

//updates everything except graph
export function update(spaceId, params={}) {
  return function(dispatch, getState) {
    let space = getSpace(getState, spaceId)
    space = Object.assign({}, space, params)
    const updates = _.pick(space, ['name', 'description'])

    dispatch(generalUpdate(spaceId, updates))
  }
}

//updates graph only
export function updateGraph(spaceId) {
  return function(dispatch, getState) {
    let {spaces, metrics, guesstimates} = getState();
    let space = e.space.get(spaces, spaceId)
    space = e.space.withGraph(space, {metrics, guesstimates});
    space.graph = _.omit(space.graph, 'simulations')
    const updates = {graph: space.graph}

    dispatch(generalUpdate(spaceId, updates))
  }
}

function meCanEdit(spaceId, state) {
  const {spaces, me} = state
  const space = e.space.get(spaces, spaceId)
  return e.space.canEdit(space, me)
}

export function registerGraphChange(spaceId) {
  return (dispatch, getState) => {
    const canEdit = meCanEdit(spaceId, getState())
    canEdit && dispatch(updateGraph(spaceId))
  }
}
