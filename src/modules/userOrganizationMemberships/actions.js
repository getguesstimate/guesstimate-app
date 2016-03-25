import {actionCreatorsFor} from 'redux-crud'
import $ from 'jquery' // TODO(matthew): Is this needed at all?
import * as displayErrorsActions from 'gModules/displayErrors/actions.js'
import {rootUrl} from 'servers/guesstimate-api/constants.js'
import {captureApiError} from 'lib/errors/index.js'
import {setupGuesstimateApi} from 'servers/guesstimate-api/constants.js'

let sActions = actionCreatorsFor('userOrganizationMemberships')

function api(state) {
  function getToken(state) {
    return _.get(state, 'me.token')
  }
  return setupGuesstimateApi(getToken(state))
}

export function fetchByOrganizationId(organizationId) {
  return (dispatch, getState) => {
    api(getState()).organizations.getMembers({organizationId}, (err, members) => {
      if (err) {
        dispatch(displayErrorsActions.newError())
        captureApiError('OrganizationsMemberFetch', null, null, err, {url: 'fetchMembers'})
      } else if (members) {
        const formatted = members.items.map(d => _.pick(d, ['id', 'user_id', 'organization_id']))
        dispatch(sActions.fetchSuccess(formatted))
      }
    })
  }
}
