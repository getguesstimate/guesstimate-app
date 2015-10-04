import {actionCreatorsFor} from 'redux-crud';
import $ from 'jquery'
import cuid from 'cuid'
import e from 'gEngine/engine'
let standardActionCreators = actionCreatorsFor('spaces');

let rootUrl = 'http://localhost:4000/'

//For some reason thie word delete won't work.
//Maybe its a reserved word or something.
export function destroy(id) {
  return function(dispatch) {
    const action = standardActionCreators.deleteStart({id: id});
    dispatch(action)

    let request = $.ajax({
      url: (rootUrl + 'spaces/' + id),
      method: 'DELETE'
    })

    request.done(() => {
      const successAction = standardActionCreators.deleteSuccess({id: id});
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
    const cid = cuid()
    object = Object.assign(object, {id: cid})

    const action = standardActionCreators.createStart(object);
    dispatch(action)

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
      method: 'PUT',
      dataType: 'json',
      contentType: 'application/json'
    })

    request.done(data => {
      const action = standardActionCreators.updateSuccess({id: spaceId})
      dispatch(action)
    })
  }
}
