import {actionCreatorsFor} from 'redux-crud';
import $ from 'jquery'
import cuid from 'cuid'
import e from 'gEngine/engine'
import _ from 'lodash'
import app from 'ampersand-app'
let standardActionCreators = actionCreatorsFor('spaces');

let rootUrl = 'http://localhost:4000/'
//let rootUrl = 'http://guesstimate.herokuapp.com/'

export function destroy(object) {
  const id = object.id;
  return function(dispatch) {
    app.router.history.navigate('/')
    const action = standardActionCreators.deleteStart({id: id});
    dispatch(action)

    let request = $.ajax({
      url: (rootUrl + 'spaces/' + id),
      method: 'DELETE'
    })

    request.done(() => {
      const successAction = standardActionCreators.deleteSuccess({id: id});
      console.log(successAction)
      dispatch(successAction)
    })
  }
}

export function fetch() {
  return function(dispatch) {
    const action = standardActionCreators.fetchStart();
    dispatch(action)

    $.getJSON((rootUrl + 'spaces'), (data) => {
      const action = standardActionCreators.fetchSuccess(data)
      dispatch(action)
    }, 'json')
  }
}

export function create(object) {
  return function(dispatch) {
    dispatch({ type: 'redux-form/START_SUBMIT', form: 'contact' })

    const cid = cuid()
    object = Object.assign(object, {id: cid})
    const action = standardActionCreators.createStart(object);

    let request = $.ajax({
      url: (rootUrl + 'spaces/'),
      data: JSON.stringify({space: object}),
      method: 'POST',
      dataType: 'json',
      contentType: 'application/json'
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
    space = e.space.withGraph(space, {metrics: state.metrics, guesstimates: state.guesstimates});

    const action = standardActionCreators.updateStart(space);
    dispatch(action)

    let request = $.ajax({
      url: (rootUrl + 'spaces/' + spaceId),
      data: JSON.stringify({space}),
      method: 'PATCH',
      dataType: 'json',
      contentType: 'application/json'
    }).done((data) => {
      const action = standardActionCreators.updateSuccess(data)
      dispatch(action)
    })
  }
}
