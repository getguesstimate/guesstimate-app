import {actionCreatorsFor} from 'redux-crud'
import cuid from 'cuid'
import * as displayErrorsActions from 'gModules/displayErrors/actions.js'
import * as membershipActions from 'gModules/userOrganizationMemberships/actions.js'
import * as userActions from 'gModules/users/actions.js'
import {captureApiError} from 'lib/errors/index.js'
import {setupGuesstimateApi} from 'servers/guesstimate-api/constants.js'
import * as userOrganizationMembershipActions from 'gModules/userOrganizationMemberships/actions.js'

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
        dispatch(userOrganizationMembershipActions.fetchByOrganizationId(organizationId))
        dispatch(sActions.fetchSuccess([organization]))
      }
    })
  }
}

export function fetchSuccess(organizations) {
  return (dispatch) => {
    const formatted = organizations.map(o => _.pick(o, ['id', 'name', 'picture', 'admin_id']))
    console.log('formatted', formatted)
    dispatch(sActions.fetchSuccess(formatted))
  }
}

export function addMember(organizationId, email) {
  return (dispatch, getState) => {
    const cid = cuid()
    let object = {id: cid}

    const action = sActions.createStart(object);

    api(getState()).organizations.addMember({organizationId, email}, (err, membership) => {
      if (err) {
        captureApiError('OrganizationMemberCreate', null, null, err, {url: 'OrganizationMemberCreate'})
      }
      else if (membership) {
        dispatch(userActions.fetchSuccess([membership._embedded.user]))
        dispatch(membershipActions.fetchSuccess([membership]))
      }
    })
  }
}
