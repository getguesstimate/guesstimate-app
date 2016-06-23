import nock from 'nock'
import expect from 'expect'

import {applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import * as actions from './actions'

const middlewares = [ thunk ]

/**
 * Creates a mock of Redux store with middleware.
 */
function mockStore(getState, expectedActions, done) {
  if (!Array.isArray(expectedActions)) {
    throw new Error('expectedActions should be an array of expected actions.')
  }
  if (typeof done !== 'undefined' && typeof done !== 'function') {
    throw new Error('done should either be undefined or function.')
  }

  function mockStoreWithoutMiddleware() {
    return {
      getState() {
        return typeof getState === 'function' ?
          getState() :
          getState
      },

      dispatch(action) {
        const expectedAction = expectedActions.shift()

        try {
          expect(action).toEqual(expectedAction)
          if (done && !expectedActions.length) {
            done()
          }
          return action
        } catch (e) {
          done(e)
        }
      }
    }
  }

  const mockStoreWithMiddleware = applyMiddleware(
    ...middlewares
  )(mockStoreWithoutMiddleware)

  return mockStoreWithMiddleware()
}

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('creates CHANGE_CANVAS_STATE when saving fails', (done) => {
    nock('http://localhost:3000/')
      .patch('/spaces/1')
      .reply(422, {})

    const expectedActions = [
      { type: 'SPACES_UPDATE_START', record: {id: 1}, data: undefined },
      { type: 'CHANGE_CANVAS_STATE', values: {actionState: 'SAVING'} },
      { type: 'CHANGE_CANVAS_STATE', values: {actionState: 'ERROR'} },
    ]
    const store = mockStore({ spaces: [{id: 1}] }, expectedActions, done)
    store.dispatch(actions.generalUpdate(1))
  })
})
