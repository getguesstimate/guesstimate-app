import {actionCreatorsFor} from 'redux-crud'
import * as displayErrorsActions from 'gModules/displayErrors/actions.js'
import * as userActions from 'gModules/users/actions.js'
import * as organizationActions from 'gModules/organizations/actions.js'
import {rootUrl} from 'servers/guesstimate-api/constants.js'
import {captureApiError} from 'lib/errors/index.js'
import {setupGuesstimateApi} from 'servers/guesstimate-api/constants.js'

let sActions = actionCreatorsFor('userOrganizationMemberships')
let relevantAttributes = ['id', 'user_id', 'organization_id']

function api(state) {
  function getToken(state) {
    return _.get(state, 'me.token')
  }
  return setupGuesstimateApi(getToken(state))
}

export function fetchByOrganizationId(organizationId) {
  return (dispatch, getState) => {
    api(getState()).organizations.getMembers({organizationId}, (err, memberships) => {
      if (err) {
        dispatch(displayErrorsActions.newError())
        captureApiError('OrganizationsMemberFetch', null, null, err, {url: 'fetchMembers'})
      } else if (memberships) {
        dispatch(fetchSuccess(memberships.items))

        const users = memberships.items.map(m => _.get(m, '_embedded.user'))
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
        dispatch(fetchSuccess(memberships.items))

        const organizations = memberships.items.map(m => _.get(m, '_embedded.organization'))
        dispatch(organizationActions.fetchSuccess(organizations))
      }
    })
  }
}

export function fetchSuccess(memberships) {
  const formatted = memberships.map(m => _.pick(m, relevantAttributes))
  return sActions.fetchSuccess(formatted)
}

export function destroy(id) {
  return (dispatch, getState) => {
    dispatch(sActions.deleteStart({id}));
    api(getState()).userOrganizationMemberships.destroy({userOrganizationMembershipId: id}, (err, value) => {
      if (err) {
        captureApiError('OrganizationsMemberDestroy', null, null, err, {url: 'destroyOrganizationMember'})
      } else {
        dispatch(sActions.deleteSuccess({id}))
      }
    })
  }
}
