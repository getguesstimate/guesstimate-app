import {actionCreatorsFor} from 'redux-crud';
import $ from 'jquery'
import e from 'gEngine/engine'
import _ from 'lodash'
import app from 'ampersand-app'
let standardActionCreators = actionCreatorsFor('users');

let rootUrl = 'http://localhost:4000/'
//let rootUrl = 'http://guesstimate.herokuapp.com/'

const standards = (state) => {
  return {
    dataType: 'json',
    contentType: 'application/json'
  }
}

const formattedRequest = ({requestParams, state}) => {
  const params = Object.assign(standards(state), requestParams)
  return $.ajax(params)
}

export function fetch() {
  return function(dispatch, getState) {
    const action = standardActionCreators.fetchStart();
    dispatch(action)

    const request = formattedRequest({
      state: getState(),
      requestParams: {
        url: (rootUrl + 'users'),
        method: 'GET',
      }
    })

    request.done(data => {
      const action = standardActionCreators.fetchSuccess(data)
      dispatch(action)
    })
  }
}
