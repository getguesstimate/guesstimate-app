import {actionCreatorsFor} from 'redux-crud';
import $ from 'jquery'
import cuid from 'cuid'
let standardActionCreators = actionCreatorsFor('spaces');

let rootUrl = 'http://guesstimate.herokuapp.com/'

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
      data: {space: object},
      method: 'POST'
    })

    request.done(data => {
      const action = standardActionCreators.createSuccess(data, cid)
      dispatch(action)
    })
  }
}
