import cuid from 'cuid'
import app from 'ampersand-app'
import {actionCreatorsFor} from 'redux-crud'

import * as displayErrorsActions from 'gModules/displayErrors/actions'
import * as membershipActions from 'gModules/userOrganizationMemberships/actions'
import * as userOrganizationMembershipActions from 'gModules/userOrganizationMemberships/actions'
import * as userOrganizationInvitationActions from 'gModules/userOrganizationInvitations/actions'
import * as factActions from 'gModules/factBank/actions'

import {captureApiError} from 'lib/errors/index'

import {setupGuesstimateApi} from 'servers/guesstimate-api/constants'

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
        captureApiError('OrganizationsFetch', err.jqXHR, err.textStatus, err, {url: 'fetch'})
      } else if (organization) {
        dispatch(fetchSuccess([organization]))
      }
    })
  }
}

export function fetchSuccess(organizations) {
  return (dispatch) => {
    const formatted = organizations.map(o => _.pick(o, ['id', 'name', 'picture', 'admin_id', 'account', 'plan']))
    dispatch(oActions.fetchSuccess(formatted))

    const memberships = _.flatten(organizations.map(o => o.memberships || []))
    const invitations = _.flatten(organizations.map(o => o.invitations || []))
    const factsByOrg = organizations.map(o => ({organization_id: o.id, facts: o.facts || []}))

    if (!_.isEmpty(memberships)) { dispatch(userOrganizationMembershipActions.fetchSuccess(memberships)) }
    if (!_.isEmpty(invitations)) { dispatch(userOrganizationInvitationActions.fetchSuccess(invitations)) }
    if (!_.isEmpty(factsByOrg)) { dispatch(factActions.loadByOrg(factsByOrg)) }
  }
}

export function create({name, plan}) {
  return (dispatch, getState) => {
    const cid = cuid()
    let object = {id: cid, organization: {name, plan} }

    // TODO(matthew): Track pending create request.
    const action = oActions.createStart(object);

    api(getState()).organizations.create(object, (err, organization) => {
      if (err) {
        // TODO(matthew): Track if request errors out.
        captureApiError('OrganizationsCreate', err.jqXHR, err.textStatus, err, {url: 'OrganizationsCreate'})
      } else if (organization) {
        dispatch(oActions.createSuccess(organization, cid))
        dispatch(userOrganizationMembershipActions.fetchSuccess(organization.memberships))
        //app.router.history.navigate('/organizations/' + value.id)
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
