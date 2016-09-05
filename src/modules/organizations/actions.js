import cuid from 'cuid'
import app from 'ampersand-app'
import {actionCreatorsFor} from 'redux-crud'

import * as displayErrorsActions from 'gModules/displayErrors/actions'
import * as membershipActions from 'gModules/userOrganizationMemberships/actions'
import * as userOrganizationMembershipActions from 'gModules/userOrganizationMemberships/actions'
import * as userOrganizationInvitationActions from 'gModules/userOrganizationInvitations/actions'
import * as factActions from 'gModules/facts/actions'
import * as spaceActions from 'gModules/spaces/actions'

import {organizationReadableId} from 'gEngine/organization'
import {withSortedValues} from 'gEngine/facts'

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
        const spaces = _.get(organization, 'fact_exporting_spaces')
        if (!_.isEmpty(spaces)) { dispatch(spaceActions.fetchSuccess(...spaces)) }
        dispatch(fetchSuccess([organization]))
      }
    })
  }
}

const toContainerFact = o => _.isEmpty(o.facts) ? {} : {variable_name: organizationReadableId(o), children: o.facts.map(withSortedValues)}

export function fetchSuccess(organizations) {
  return (dispatch) => {
    const formatted = organizations.map(o => _.pick(o, ['id', 'name', 'picture', 'admin_id', 'account', 'plan']))

    const memberships = _.flatten(organizations.map(o => o.memberships || []))
    const invitations = _.flatten(organizations.map(o => o.invitations || []))
    const factsByOrg = organizations.map(toContainerFact).filter(o => !_.isEmpty(o))

    if (!_.isEmpty(memberships)) { dispatch(userOrganizationMembershipActions.fetchSuccess(memberships)) }
    if (!_.isEmpty(invitations)) { dispatch(userOrganizationInvitationActions.fetchSuccess(invitations)) }
    if (!_.isEmpty(factsByOrg)) { dispatch(factActions.loadByOrg(factsByOrg)) }

    dispatch(oActions.fetchSuccess(formatted))
  }
}

export function create({name, plan}) {
  return (dispatch, getState) => {
    const cid = cuid()
    let object = {id: cid, organization: {name, plan} }

    // TODO(matthew): Track pending create request.
    const action = oActions.createStart(object)

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
    api(getState()).organizations.addMember({organizationId, email}, (err, membership) => {
      if (!!membership) {
        dispatch(userActions.fetchSuccess([membership._embedded.user]))
        dispatch(membershipActions.createSuccess([membership]))
      }
    })
  }
}

// addFact adds the passed fact, with sortedValues overwritten to null, to the organization and saves it on the server.
export function addFact(organization, rawFact) {
  return (dispatch, getState) => {
    let fact = Object.assign({}, rawFact)
    _.set(fact, 'simulation.sample.sortedValues', null)

    api(getState()).organizations.addFact(organization, fact, (err, serverFact) => {
      if (!!serverFact) {
        dispatch(factActions.addToOrg(organizationReadableId(organization), serverFact))
      }
    })
  }
}

// editFact edits the passed fact, with sortedValues overwritten to null, to the organization and saves it on the server.
export function editFact(organization, rawFact) {
  // TODO(matthew): Build dependency chain here?
  return (dispatch, getState) => {
    let fact = Object.assign({}, rawFact)
    _.set(fact, 'simulation.sample.sortedValues', null)

    api(getState()).organizations.editFact(organization, fact, (err, serverFact) => {
      if (!!serverFact) {
        dispatch(factActions.updateWithinOrg(organizationReadableId(organization), serverFact))
      }
    })
  }
}

export function deleteFact(organization, fact) {
  return (dispatch, getState) => {
    api(getState()).organizations.deleteFact(organization, fact, (err, serverFact) => {
      if (err) {
        captureApiError('OrganizationsFactDestroy', err.jqXHR, err.textStatus, err, {url: 'destroyOrganizationMember'})
      } else {
        dispatch(factActions.deleteFromOrg(organizationReadableId(organization), fact))
      }
    })
  }
}
