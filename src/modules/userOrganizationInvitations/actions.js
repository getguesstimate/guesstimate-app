import {actionCreatorsFor} from 'redux-crud'
import cuid from 'cuid'
import * as displayErrorsActions from 'gModules/displayErrors/actions.js'
import * as userActions from 'gModules/users/actions.js'
import * as membershipActions from 'gModules/userOrganizationMemberships/actions.js'
import * as organizationActions from 'gModules/organizations/actions.js'
import * as httpRequestActions from 'gModules/httpRequests/actions.js'
import {rootUrl} from 'servers/guesstimate-api/constants.js'
import {captureApiError} from 'lib/errors/index.js'
import {setupGuesstimateApi} from 'servers/guesstimate-api/constants.js'

let sActions = actionCreatorsFor('userOrganizationInvitations')
let relevantAttributes = ['id', 'email', 'organization_id']

function api(state) {
  function getToken(state) {
    return _.get(state, 'me.token')
  }
  return setupGuesstimateApi(getToken(state))
}

export function fetchByOrganizationId(organizationId) {
  return (dispatch, getState) => {
    api(getState()).organizations.getInvitations({organizationId}, (err, invitations) => {
      if (err) {
        dispatch(displayErrorsActions.newError())
        captureApiError('OrganizationsInvitationsFetch', null, null, err, {url: 'fetchMembers'})
      } else if (invitations) {
        debugger
        dispatch(fetchSuccess(invitations.items))

        const memberships = invitations.items.map(i => _.get(i, '_embedded.membership')).filter(m => !!m)
        dispatch(membershipActions.fetchSuccess(memberships))

        const users = memberships.map(m => _.get(m, '_embedded.user')).filter(u => !!u)
        dispatch(userActions.fetchSuccess(users))
      }
    })
  }
}

export function fetchSuccess(invitations) {
  const formatted = invitations.map(m => _.pick(m, relevantAttributes))
  return sActions.fetchSuccess(formatted)
}
