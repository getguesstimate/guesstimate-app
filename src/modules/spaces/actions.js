import {actionCreatorsFor} from 'redux-crud';
import $ from 'jquery'
import cuid from 'cuid'
import e from 'gEngine/engine'
import _ from 'lodash'
import app from 'ampersand-app'
import {rootUrl} from 'servers/guesstimate-api/constants.js'
import {captureApiError} from 'lib/errors/index.js'

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

export function fetch() {
  return function(dispatch, getState) {
    const action = standardActionCreators.fetchStart();
    dispatch(action)

    const request = formattedRequest({
      state: getState(),
      requestParams: {
        url: (rootUrl + 'spaces'),
        method: 'GET',
      }
    })

    request.done(data => {
      const action = standardActionCreators.fetchSuccess(data)
      dispatch(action)
    })

    request.fail((jqXHR, textStatus, errorThrown) => {
      captureApiError('SpacesFetch', jqXHR, textStatus, errorThrown, {url: (rootUrl+'spaces')})
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

export function update(spaceId, params={}) {
  return function(dispatch, getState) {
    let {spaces, metrics, guesstimates} = getState();
    let space = e.space.get(spaces, spaceId)
    space = e.space.withGraph(space, {metrics, guesstimates});
    space.graph = _.omit(space.graph, 'simulations')
    Object.assign(space, params)

    const action = standardActionCreators.updateStart(space);
    dispatch(action)

    const request = formattedRequest({
      state: getState(),
      requestParams: {
        url: (rootUrl + 'spaces/' + spaceId),
        method: 'PATCH',
        data: JSON.stringify({space})
      }
    })

    request.done((data) => {
      const action = standardActionCreators.updateSuccess(data)
      dispatch(action)
    })
    request.fail((jqXHR, textStatus, errorThrown) => {
      captureApiError('SpacesUpdate', jqXHR, textStatus, errorThrown, {url: (rootUrl + 'spaces/' + spaceId)})
    })
  }
}
