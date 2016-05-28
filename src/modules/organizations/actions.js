import cuid from 'cuid'
import app from 'ampersand-app'

import {actionCreatorsFor} from 'redux-crud'
import * as displayErrorsActions from 'gModules/displayErrors/actions.js'
import * as membershipActions from 'gModules/userOrganizationMemberships/actions.js'
import {captureApiError} from 'lib/errors/index.js'
import {setupGuesstimateApi} from 'servers/guesstimate-api/constants.js'
import * as userOrganizationMembershipActions from 'gModules/userOrganizationMemberships/actions.js'

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
        dispatch(userOrganizationMembershipActions.fetchByOrganizationId(organizationId))
        dispatch(oActions.fetchSuccess([organization]))
      }
    })
  }
}

export function fetchSuccess(organizations) {
  return (dispatch) => {
    const formatted = organizations.map(o => _.pick(o, ['id', 'name', 'picture']))
    dispatch(oActions.fetchSuccess(formatted))
  }
}

export function create(name) {
  return (dispatch, getState) => {
    const cid = cuid()
    let object = {id: cid, organization: {name} }

    //dispatch(changeOrganizationCreationState('CREATING'))
    const action = oActions.createStart(object);

    api(getState()).organizations.create(object, (err, value) => {
      if (err) {
        //dispatch(changeOrganizationCreationState('ERROR_CREATING'))
        captureApiError('OrganizationsCreate', null, null, err, {url: 'OrganizationsCreate'})
      } else if (value) {
        //dispatch(changeOrganizationCreationState('CREATED'))
        dispatch(oActions.createSuccess(value, cid))
        app.router.history.navigate('/organizations/' + value.id)
      }
    })
  }
}
