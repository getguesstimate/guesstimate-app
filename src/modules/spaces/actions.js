import {actionCreatorsFor} from 'redux-crud';
import $ from 'jquery'
import cuid from 'cuid'
import e from 'gEngine/engine'
import app from 'ampersand-app'
import {rootUrl} from 'servers/guesstimate-api/constants.js'
import {captureApiError} from 'lib/errors/index.js'
import {changeActionState} from 'gModules/canvas_state/actions.js'
import * as userActions from 'gModules/users/actions.js'
import {setupGuesstimateApi} from 'servers/guesstimate-api/constants.js'

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
    app.router.history.navigate('/models')
    dispatch(sActions.deleteStart({id}));

    api(getState()).models.destroy({spaceId: id}, (err, value) => {
      if (err) {
        captureApiError('SpacesDestroy', null, null, err, {url: 'spacesfetch'})
      }
      else if (value) {
        dispatch(sActions.deleteSuccess({id}))
      }
    })
  }
}

export function fromSearch(data) {
  return (dispatch) => {
    const formatted = data.map(d => _.pick(d, ['id', 'name', 'description', 'user_id', 'updated_at', 'metric_count', 'is_private']))
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
      }
      else if (value) {
        dispatch(sActions.fetchSuccess([value]))

        const users = getState().users
        const user_id = value.user_id
        const has_user = !!(users.find(e => e.id === user_id))
        if (!has_user) { dispatch(userActions.fetchById(user_id)) }
      }
    })
  }
}

//required userId for now, but later this can be optional
export function fetch({userId}) {
  return (dispatch, getState) => {
    dispatch(sActions.fetchStart())

    api(getState()).models.list({userId}, (err, value) => {
      if (err) {
        captureApiError('SpacesFetch', null, null, err, {url: 'fetch'})
      }
      else if (value) {
        const formatted = value.items.map(d => _.pick(d, ['id', 'name', 'description', 'user_id', 'updated_at', 'metric_count', 'is_private']))
        dispatch(sActions.fetchSuccess(formatted))
      }
    })
  }
}

export function create(object) {
  return (dispatch, getState) => {

    const cid = cuid()
    object = Object.assign(object, {id: cid})
    const action = sActions.createStart(object);

    api(getState()).models.create(object, (err, value) => {
      if (err) {
        captureApiError('SpacesCreate', null, null, err, {url: 'SpacesCreate'})
      }
      else if (value) {
        dispatch(sActions.createSuccess(value, cid))
        app.router.history.navigate('/models/' + value.id)
      }
    })
  }
}

export function fork(spaceId) {
  return (dispatch, getState) => {
    dispatch(changeActionState('FORKING'))

    const cid = cuid()
    const action = sActions.createStart({id:cid});

    api(getState()).forks.create({spaceId}, (err, value) => {
      if (err) {
        dispatch(changeActionState('ERROR_FORKING'))
        captureApiError('SpacesCreate', null, null, err, {url: 'SpacesCreate'})
      }
      else if (value) {
        dispatch(changeActionState('FORKED'))
        dispatch(sActions.createSuccess(value, cid))
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

    api(getState()).models.update(spaceId, params, (err, value) => {
      if (err) {
        captureApiError('SpacesUpdate', null, null, err, {url: 'SpacesUpdate'})
        dispatch(changeActionState('ERROR'))
      }
      else if (value) {
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
export function updateGraph(spaceId) {
  return (dispatch, getState) => {
    let {spaces, metrics, guesstimates} = getState();
    let space = e.space.get(spaces, spaceId)
    space = e.space.withGraph(space, {metrics, guesstimates});
    space.graph = _.omit(space.graph, 'simulations')
    const updates = {graph: space.graph}

    dispatch(generalUpdate(spaceId, updates))
  }
}

function meCanEdit(spaceId, state) {
  const {spaces, me} = state
  const space = e.space.get(spaces, spaceId)
  return e.space.canEdit(space, me)
}

export function registerGraphChange(spaceId) {
  return (dispatch, getState) => {
    const canEdit = meCanEdit(spaceId, getState())
    canEdit && dispatch(updateGraph(spaceId))
  }
}
