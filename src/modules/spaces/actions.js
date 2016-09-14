import {actionCreatorsFor} from 'redux-crud'

import cuid from 'cuid'
import app from 'ampersand-app'

import {changeActionState} from 'gModules/canvas_state/actions'
import {saveCheckpoint, initSpace} from 'gModules/checkpoints/actions'
import * as userActions from 'gModules/users/actions'
import * as organizationActions from 'gModules/organizations/actions'
import * as calculatorActions from 'gModules/calculators/actions'

import e from 'gEngine/engine'

import {captureApiError} from 'lib/errors/index'

import {rootUrl, setupGuesstimateApi} from 'servers/guesstimate-api/constants'

let sActions = actionCreatorsFor('spaces')

function api(state) {
  function getToken(state) {
    return _.get(state, 'me.token')
  }
  return setupGuesstimateApi(getToken(state))
}

export function fetchSuccess(spaces) {
  return (dispatch, getState) => {
    dispatch(sActions.fetchSuccess(spaces.map(s => _.omit(s, ['_embedded']))))

    spaces.forEach(({id, graph}) => {
      // We need to check if the space is already initialized as we do not want to double-initialize a space.
      const isInitialized = e.collections.some(getState().checkpoints, id, 'spaceId')
      if (!isInitialized) { dispatch(initSpace(id, graph)) }
    })

    const users = spaces.map(s => _.get(s, '_embedded.user')).filter(e.utils.isPresent)
    const organizations = spaces.map(s => {
      const organization = _.get(s, '_embedded.organization')
      if (!e.utils.isPresent(organization)) { return null }
      return {
        ...organization,
        facts: [...e.utils.orArr(_.get(organization, 'facts')), ...e.utils.orArr(_.get(s, 'imported_facts'))],
      }
    }).filter(e.utils.isPresent)
    const calculators = _.flatten(spaces.map(s => e.utils.orArr(_.get(s, '_embedded.calculators')))).filter(e.utils.isPresent)

    if (!_.isEmpty(calculators)) {dispatch(calculatorActions.sActions.fetchSuccess(calculators))}
    if (!_.isEmpty(organizations)) { dispatch(organizationActions.fetchSuccess(organizations)) }
    if (!_.isEmpty(users)) { dispatch(userActions.fetchSuccess(users)) }
  }
}

export function destroy(object) {
  const id = object.id
  return (dispatch, getState) => {

    const navigateTo = !!object.organization_id ? e.organization.urlById(object.organization_id) : e.user.urlById(object.user_id)
    app.router.history.navigate(navigateTo)

    dispatch(sActions.deleteStart({id}))

    api(getState()).models.destroy({spaceId: id}, (err, value) => {
      if (err) {
        captureApiError('SpacesDestroy', err.jqXHR, err.textStatus, err, {url: 'spacesfetch'})
      } else {
        dispatch(sActions.deleteSuccess({id}))
      }
    })
  }
}

export function fromSearch(data) {
  return (dispatch) => {
    const formatted = data.map(d => _.pick(d, ['id', 'name', 'description', 'user_id', 'updated_at', 'metric_count', 'is_private', 'screenshot', 'big_screenshot', 'viewcount']))
    const action = sActions.fetchSuccess(formatted)
    dispatch(action)
  }
}

export function fetchById(spaceId, token=null) {
  return (dispatch, getState) => {
    dispatch(sActions.fetchStart())

    api(getState()).models.get(spaceId, token, (err, value) => {
      if (err) {
        captureApiError('SpacesFetch', err.jqXHR, err.textStatus, err, {url: 'spacesfetch'})
        return
      }

      dispatch(fetchSuccess([value]))
    })
  }
}

//required userId for now, but later this can be optional
export function fetch({userId, organizationId}) {
  return (dispatch, getState) => {
    dispatch(sActions.fetchStart())
    api(getState()).models.list({userId, organizationId}, (err, value) => {
      if (err) {
        captureApiError('SpacesFetch', err.jqXHR, err.textStatus, err, {url: 'fetch'})
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
    const action = sActions.createStart(object)

    api(getState()).models.create(object, (err, value) => {
      if (err) {
        dispatch(changeActionState('ERROR_CREATING'))
        captureApiError('SpacesCreate', err.jqXHR, err.textStatus, err, {url: 'SpacesCreate'})
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
    const action = sActions.createStart({id:cid})

    api(getState()).copies.create({spaceId}, (err, value) => {
      if (err) {
        dispatch(changeActionState('ERROR_COPYING'))
        captureApiError('SpacesCreate', err.jqXHR, err.textStatus, err, {url: 'SpacesCreate'})
      } else if (value) {
        dispatch(changeActionState('COPIED'))
        // Signal the resource was created.
        dispatch(sActions.createSuccess(value, cid))
        // And that we've fetched new data from it. We have to do this in this case as the new resource is pre-populated
        // with some data.
        dispatch(fetchSuccess([value]))

        app.router.history.navigate('/models/' + value.id)
      }
    })
  }
}

function getSpace(getState, spaceId) {
  let {spaces, metrics, guesstimates} = getState()
  return e.collections.get(spaces, spaceId)
}

export function generalUpdate(spaceId, params) {
  return (dispatch, getState) => {
    const space = {...getSpace(getState, spaceId), ...params}
    const usesFacts = _.has(space, 'graph.guesstimates') && _.some(
      space.graph.guesstimates, g => !!_.get(g, 'expression') && g.expression.includes(e.simulation.FACT_ID_PREFIX)
    )
    const isPrivate = space.is_private
    if (!isPrivate && usesFacts) {
      dispatch(changeActionState('ERROR'))
      return
    }

    dispatch(sActions.updateStart(space))
    dispatch(changeActionState('SAVING'))

    const updateMsg = {...params, previous_updated_at: space.updated_at}
    api(getState()).models.update(spaceId, updateMsg, (err, value) => {
      if (err) {
        if (err === 'Conflict') {
          dispatch(changeActionState('CONFLICT'))
        } else {
          captureApiError('SpacesUpdate', err.jqXHR, err.textStatus,  err, {url: 'SpacesUpdate'})
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
    let {spaces, metrics, guesstimates} = getState()
    let space = e.collections.get(spaces, spaceId)
    space = e.space.withGraph(space, {metrics, guesstimates})
    space.graph = _.omit(space.graph, 'simulations')
    const updates = {graph: space.graph}

    dispatch(saveCheckpoint(spaceId, space.graph))
    if (saveOnServer) {
      dispatch(generalUpdate(spaceId, updates))
    } else {
      dispatch(changeActionState('UNALLOWED_ATTEMPT'))
    }
  }
}

function meCanEdit(spaceId, state) {
  const {spaces, me, userOrganizationMemberships, canvasState} = state
  const space = e.collections.get(spaces, spaceId)
  return e.space.canEdit(space, me, userOrganizationMemberships, canvasState)
}

export function registerGraphChange(spaceId) {
  return (dispatch, getState) => {
    const canEdit = meCanEdit(spaceId, getState())
    dispatch(updateGraph(spaceId, canEdit))
  }
}

export function enableShareableLink(spaceId) {
  return (dispatch, _1) => {
    api(getState()).models.enableShareableLink(spaceId, (err, value) => {
      if (err) {
        captureApiError('SpacesEnableShareableLink', err.jqXHR, err.textStatus,  err, {url: 'SpacesEnableShareableLink'})
      } else if (value) {
        dispatch(sActions.updateSuccess(value))
      }
    })
  }
}

export function disableShareableLink(spaceId) {
  return (dispatch, _1) => {
    api(getState()).models.disableShareableLink(spaceId, (err, value) => {
      if (err) {
        captureApiError('SpacesDisableShareableLink', err.jqXHR, err.textStatus,  err, {url: 'SpacesDisableShareableLink'})
      } else if (value) {
        dispatch(sActions.updateSuccess(value))
      }
    })
  }
}

export function rotateShareableLink(spaceId) {
  return (dispatch, _1) => {
    api(getState()).models.rotateShareableLink(spaceId, (err, value) => {
      if (err) {
        captureApiError('SpacesRotateShareableLink', err.jqXHR, err.textStatus,  err, {url: 'SpacesRotateShareableLink'})
      } else if (value) {
        dispatch(sActions.updateSuccess(value))
      }
    })
  }
}
