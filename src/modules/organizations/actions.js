import cuid from 'cuid'
import app from 'ampersand-app'
import {actionCreatorsFor} from 'redux-crud'

import * as displayErrorsActions from 'gModules/displayErrors/actions.js'
import * as membershipActions from 'gModules/userOrganizationMemberships/actions.js'
import * as userOrganizationMembershipActions from 'gModules/userOrganizationMemberships/actions.js'
import * as userOrganizationInvitationActions from 'gModules/userOrganizationInvitations/actions.js'

import {captureApiError} from 'lib/errors/index.js'

import {setupGuesstimateApi} from 'servers/guesstimate-api/constants.js'

let oActions = actionCreatorsFor('organizations')

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
        dispatch(oActions.fetchSuccess([organization]))

        const memberships = !!organization.memberships ? organization.memberships : []
        const invitations = !!organization.invitations ? organization.invitations : []

        dispatch(userOrganizationMembershipActions.fetchSuccess(memberships))
        dispatch(userOrganizationInvitationActions.fetchSuccess(invitations))
      }
    })
  }
}

export function fetchSuccess(organizations) {
  return (dispatch) => {
    const formatted = organizations.map(o => _.pick(o, ['id', 'name', 'picture', 'admin_id']))
    dispatch(oActions.fetchSuccess(formatted))
  }
}

export function create(name) {
  return (dispatch, getState) => {
    const cid = cuid()
    let object = {id: cid, organization: {name} }

    // TODO(matthew): Track pending create request.
    const action = oActions.createStart(object);

    api(getState()).organizations.create(object, (err, value) => {
      if (err) {
        // TODO(matthew): Track if request errors out.
        captureApiError('OrganizationsCreate', null, null, err, {url: 'OrganizationsCreate'})
      } else if (value) {
        dispatch(oActions.createSuccess(value, cid))
        app.router.history.navigate('/organizations/' + value.id)
      }
    })
  }
}

export function addMember(organizationId, email) {
  return (dispatch, getState) => {
    const cid = cuid()
    let object = {id: cid, organization_id: organizationId, user_id: 4}

    const action = oActions.createStart(object);

    api(getState()).organizations.addMember({organizationId, email}, (err, membership) => {
      if (err) {
        dispatch(oActions.createError(err, object))
      }
      else if (membership) {
        dispatch(userActions.fetchSuccess([membership._embedded.user]))
        dispatch(membershipActions.createSuccess([membership]))
      }
    })
  }
}
