import {actionCreatorsFor} from 'redux-crud';
import $ from 'jquery'
let standardActionCreators = actionCreatorsFor('spaces');

let rootUrl = 'http://guesstimate.herokuapp.com/'
export function get() {
  return function(dispatch) {
    const action = standardActionCreators.fetchStart();
    dispatch(action)

    $.getJSON((rootUrl + 'spaces'), (data) => {
      const action = standardActionCreators.fetchSuccess(data)
      dispatch(action)
    }, 'json')
  }
}
