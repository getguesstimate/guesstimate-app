import React from 'react'
import {Provider} from 'react-redux'
import {createStore} from 'redux'

import rootReducer from 'gModules/reducers.js'

import {GuesstimateRecorder} from 'lib/recorder'
window.recorder = new GuesstimateRecorder()

const testStore = createStore(rootReducer)

/*
 * The TestRoot component allows one to wrap a connected component in a test store allowing it to be tested.
 */

export const TestRoot = ({children}) => (
  <Provider store={testStore}>
    {children}
  </Provider>
)
