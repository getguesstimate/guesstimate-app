import {actionCreatorsFor} from 'redux-crud'
import cuid from 'cuid'
import * as displayErrorsActions from 'gModules/displayErrors/actions.js'
import * as userActions from 'gModules/users/actions.js'
import * as organizationActions from 'gModules/organizations/actions.js'
import * as httpRequestActions from 'gModules/httpRequests/actions.js'
import {rootUrl} from 'servers/guesstimate-api/constants.js'
import {captureApiError} from 'lib/errors/index.js'
import {setupGuesstimateApi} from 'servers/guesstimate-api/constants.js'

let sActions = actionCreatorsFor('userOrganizationMemberships')
let relevantAttributes = ['id', 'user_id', 'organization_id', 'invitation_id']

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

        const users = memberships.items.map(m => _.get(m, '_embedded.user')).filter(u => !!u)
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
        const membership = _.get(invitation, '_embedded.membership')
        const user = _.get(invitation, '_embedded.membership._embedded.user')

        if (membership) { dispatch(sActions.createSuccess(membership)) }
        if (user) { dispatch(userActions.fetchSuccess([user]))}

        dispatch(httpRequestActions.success({id: cid, response: {hasUser: (!!user)}}))
      }
    })
  }
}
