import {actionCreatorsFor} from 'redux-crud';
import $ from 'jquery'
import cuid from 'cuid'
import e from 'gEngine/engine'
import _ from 'lodash'
import app from 'ampersand-app'
import {rootUrl} from 'servers/guesstimate-api/constants.js'
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
    app.router.history.navigate('/')
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
      console.log(successAction)
      dispatch(successAction)
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
      app.router.history.navigate('/space/' + data.id)
    })
  }
}

export function update(spaceId) {
  return function(dispatch, getState) {
    let state = getState();
    let space = e.space.get(state.spaces, spaceId)
    space = e.space.withGraph(space, {metrics: state.metrics, guesstimates: state.guesstimates, simulations: state.simulations});
    space.graph.simulations = space.graph.simulations.map(s => _.omit(s, 'sample'))

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
  }
}
