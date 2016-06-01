import {actionCreatorsFor} from 'redux-crud'
import * as displayErrorsActions from 'gModules/displayErrors/actions.js'
import * as userActions from 'gModules/users/actions.js'
import * as organizationActions from 'gModules/organizations/actions.js'
import {rootUrl} from 'servers/guesstimate-api/constants.js'
import {captureApiError} from 'lib/errors/index.js'
import {setupGuesstimateApi} from 'servers/guesstimate-api/constants.js'

export const sActions = actionCreatorsFor('userOrganizationMemberships')

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
        console.log("sneaky!")
        const formatted = members.items.map(m => _.pick(m, ['id', 'user_id', 'organization_id']))
        dispatch(sActions.fetchSuccess(formatted))

        const users = members.items.map(m => _.get(m, '_embedded.user')).filter(u => !!u)
        dispatch(userActions.fetchSuccess(users))
      }
    })
  }
}

export function fetchByUserId(userId) {
  return (dispatch, getState) => {
    api(getState()).users.getMemberships({userId}, (err, memberships) => {
      if (err) {
        dispatch(displayErrorsActions.newError())
        captureApiError('OrganizationsMemberFetch', null, null, err, {url: 'fetchMembers'})
      } else if (memberships) {
        const formatted = memberships.items.map(m => _.pick(m, ['id', 'user_id', 'organization_id']))
        dispatch(sActions.fetchSuccess(formatted))

        //const organizations = memberships.items.map(m => _.get(m, '_embedded.organization')).filter(o => !!o)
        //dispatch(organizationActions.fetchSuccess(organizations))
      }
    })
  }
}
