import {actionCreatorsFor} from 'redux-crud'
import $ from 'jquery' // TODO(matthew): Is this needed at all?
import * as displayErrorsActions from 'gModules/displayErrors/actions.js'
import {captureApiError} from 'lib/errors/index.js'
import {setupGuesstimateApi} from 'servers/guesstimate-api/constants.js'

let sActions = actionCreatorsFor('organizations')

function api(state) {
  function getToken(state) {
    return _.get(state, 'me.token')
  }
  return setupGuesstimateApi(getToken(state))
}

export function fetchById(organizationId) {
  return (dispatch, getState) => {
    api(getState()).organizations.get({organizationId}, (err, organization) => {
      if (err) {
        dispatch(displayErrorsActions.newError())
        captureApiError('OrganizationsFetch', null, null, err, {url: 'fetch'})
      } else if (organization) {
        dispatch(sActions.fetchSuccess([organization]))
      }
    })
  }
}
