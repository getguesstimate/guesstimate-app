import {actionCreatorsFor} from 'redux-crud'

import cuid from 'cuid'

import * as displayErrorsActions from 'gModules/displayErrors/actions'
import * as userActions from 'gModules/users/actions'
import * as invitationActions from 'gModules/userOrganizationInvitations/actions'
import * as httpRequestActions from 'gModules/httpRequests/actions'

import {captureApiError} from 'lib/errors/index'

import {setupGuesstimateApi} from 'servers/guesstimate-api/constants'

const sActions = actionCreatorsFor('userOrganizationMemberships')
const relevantAttributes = ['id', 'user_id', 'organization_id', 'invitation_id']

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
      }
    })
  }
}

export function fetchSuccess(memberships) {
  return (dispatch, getState) => {
    const formatted = memberships.map(m => _.pick(m, relevantAttributes))
    const users = memberships.map(m => _.get(m, '_embedded.user')).filter(u => !!u)
    const organizations = memberships.map(m => _.get(m, '_embedded.organization')).filter(o => !!o)
    dispatch(sActions.fetchSuccess(formatted, {users, organizations}))
  }
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

export function createWithEmail(organizationId, email) {
  return (dispatch, getState) => {
    const cid = cuid()
    let object = {id: cid, organization_id: organizationId}

    dispatch(httpRequestActions.start({id: cid, entity: 'userOrganizationMembershipCreate', metadata: {organizationId, email}}))
    api(getState()).organizations.addMember({organizationId, email}, (err, invitation) => {
      if (err) {
        dispatch(sActions.createError(err, object))
        dispatch(httpRequestActions.failure({id: cid, error: err}))
      }
      else if (invitation) {
        dispatch(invitationActions.fetchSuccess([invitation]))

        const membership = _.get(invitation, '_embedded.membership')
        const user = _.get(membership, '_embedded.user')

        if (membership) { dispatch(sActions.createSuccess(membership)) }
        if (user) { dispatch(userActions.fetchSuccess([user]))}

        dispatch(httpRequestActions.success({id: cid, response: {hasUser: (!!user)}}))
      }
    })
  }
}
