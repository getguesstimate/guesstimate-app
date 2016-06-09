import {actionCreatorsFor} from 'redux-crud'
import cuid from 'cuid'
import e from 'gEngine/engine'
import app from 'ampersand-app'

import {changeActionState} from 'gModules/canvas_state/actions'
import {saveCheckpoint} from 'gModules/checkpoints/actions'
import * as userActions from 'gModules/users/actions'
import * as organizationActions from 'gModules/organizations/actions'
import {initSpace} from 'gModules/checkpoints/actions'

import {rootUrl, setupGuesstimateApi} from 'servers/guesstimate-api/constants'

import {captureApiError} from 'lib/errors/index'

let sActions = actionCreatorsFor('spaces');

function api(state) {
  function getToken(state) {
    return _.get(state, 'me.token')
  }
  return setupGuesstimateApi(getToken(state))
}

export function destroy(object) {
  const id = object.id;
  return (dispatch, getState) => {

    const navigateTo = !!object.organization_id ? e.organization.urlById(object.organization_id) : e.user.urlById(object.user_id)
    app.router.history.navigate(navigateTo)

    dispatch(sActions.deleteStart({id}));

    api(getState()).models.destroy({spaceId: id}, (err, value) => {
      if (err) {
        captureApiError('SpacesDestroy', null, null, err, {url: 'spacesfetch'})
      } else {
        dispatch(sActions.deleteSuccess({id}))
      }
    })
  }
}

export function fromSearch(data) {
  return (dispatch) => {
    const formatted = data.map(d => _.pick(d, ['id', 'name', 'description', 'user_id', 'updated_at', 'metric_count', 'is_private', 'screenshot', 'big_screenshot']))
    const action = sActions.fetchSuccess(formatted)
    dispatch(action)
  }
}

export function fetchById(spaceId) {
  return (dispatch, getState) => {
    dispatch(sActions.fetchStart())

    api(getState()).models.get({spaceId}, (err, value) => {
      if (err) {
        captureApiError('SpacesFetch', null, null, err, {url: 'spacesfetch'})
        return
      }

      dispatch(sActions.fetchSuccess([value]))
      dispatch(initSpace(spaceId, value.graph))

      const user = _.get(value, '_embedded.user')
      const organization = _.get(value, '_embedded.organization')

      if (!!organization) {dispatch(organizationActions.fetchSuccess([organization]))}
      if (!!user) {
        dispatch(userActions.fetchSuccess([user]))
      } else {
        console.warn("No user returned with a space.")
      }
    })
  }
}

//required userId for now, but later this can be optional
export function fetch({userId, organizationId}) {
  return (dispatch, getState) => {
    dispatch(sActions.fetchStart())
    api(getState()).models.list({userId, organizationId}, (err, value) => {
      if (err) {
        captureApiError('SpacesFetch', null, null, err, {url: 'fetch'})
      } else if (value) {
        const formatted = value.items.map(d => _.pick(d, ['id', 'name', 'description', 'user_id', 'organization_id', 'updated_at', 'metric_count', 'is_private', 'screenshot', 'big_screenshot']))
        dispatch(sActions.fetchSuccess(formatted))

        const users = value.items.map(d => _.get(d, 'user')).filter(u => !!u)
        dispatch(userActions.fetchSuccess(users))
      }
    })
  }
}

export function create(organizationId, params={}) {
  return (dispatch, getState) => {
    const cid = cuid()
    let object = {...params, id: cid}
    if (organizationId) {
      object.organization_id = organizationId
    }

    dispatch(changeActionState('CREATING'))
    const action = sActions.createStart(object);

    api(getState()).models.create(object, (err, value) => {
      if (err) {
        dispatch(changeActionState('ERROR_CREATING'))
        captureApiError('SpacesCreate', null, null, err, {url: 'SpacesCreate'})
      }
      else if (value) {
        dispatch(changeActionState('CREATED'))
        dispatch(sActions.createSuccess(value, cid))
        dispatch(initSpace(value.id, {metrics: [], guesstimates: []}))
        app.router.history.navigate('/models/' + value.id)
      }
    })
  }
}

export function copy(spaceId) {
  return (dispatch, getState) => {
    dispatch(changeActionState('COPYING'))

    const cid = cuid()
    const action = sActions.createStart({id:cid});

    api(getState()).copies.create({spaceId}, (err, value) => {
      if (err) {
        dispatch(changeActionState('ERROR_COPYING'))
        captureApiError('SpacesCreate', null, null, err, {url: 'SpacesCreate'})
      }
      else if (value) {
        dispatch(changeActionState('COPIED'))
        // Signal the resource was created.
        dispatch(sActions.createSuccess(value, cid))
        // And that we've fetched new data from it. We have to do this in this case as the new resource is pre-populated
        // with some data.
        dispatch(sActions.fetchSuccess([value]))

        app.router.history.navigate('/models/' + value.id)
      }
    })
  }
}

function getSpace(getState, spaceId) {
  let {spaces, metrics, guesstimates} = getState();
  return e.space.get(spaces, spaceId)
}

export function generalUpdate(spaceId, params) {
  return (dispatch, getState) => {

    const space = Object.assign({}, getSpace(getState, spaceId), params)

    dispatch(sActions.updateStart(space))
    dispatch(changeActionState('SAVING'))

    const updateMsg = {...params, previous_updated_at: space.updated_at}
    api(getState()).models.update(spaceId, updateMsg, (err, value) => {
      if (err) {
        if (err === 'Conflict') {
          dispatch(changeActionState('CONFLICT'))
        } else {
          captureApiError('SpacesUpdate', null, null, err, {url: 'SpacesUpdate'})
          dispatch(changeActionState('ERROR'))
        }
      } else if (value) {
        dispatch(sActions.updateSuccess(value))
        dispatch(changeActionState('SAVED'))
      }
    })
  }
}

//updates everything except graph
export function update(spaceId, params={}) {
  return (dispatch, getState) => {
    let space = getSpace(getState, spaceId)
    space = Object.assign({}, space, params)
    const updates = _.pick(space, ['name', 'description'])

    dispatch(generalUpdate(spaceId, updates))
  }
}

//updates graph only
export function updateGraph(spaceId, saveOnServer=true) {
  return (dispatch, getState) => {
    let {spaces, metrics, guesstimates} = getState();
    let space = e.space.get(spaces, spaceId)
    space = e.space.withGraph(space, {metrics, guesstimates});
    space.graph = _.omit(space.graph, 'simulations')
    const updates = {graph: space.graph}

    dispatch(saveCheckpoint(spaceId, space.graph))
    if (saveOnServer) {
      dispatch(generalUpdate(spaceId, updates))
    }
  }
}

function meCanEdit(spaceId, state) {
  const {spaces, me, userOrganizationMemberships, canvasState} = state
  const space = e.space.get(spaces, spaceId)
  return e.space.canEdit(space, me, userOrganizationMemberships, canvasState)
}

export function registerGraphChange(spaceId) {
  return (dispatch, getState) => {
    const canEdit = meCanEdit(spaceId, getState())
    dispatch(updateGraph(spaceId, canEdit))
  }
}
