import React from 'react'
import TestUtils from 'react-addons-test-utils'
import {Provider} from 'react-redux'
import {createStore} from 'redux'

import rootReducer from 'gModules/reducers.js'

import {GuesstimateRecorder} from 'lib/recorder'
window.recorder = new GuesstimateRecorder()

import {SpaceToolbar} from '../index'

const testStore = createStore(rootReducer)

describe('<SpaceToolbar>', () => {
  it ('renders the view form', () => {
    const toolbar = TestUtils.renderIntoDocument(
      <Provider store={testStore}>
        <SpaceToolbar />
      </Provider>
    )

    TestUtils.findRenderedDOMComponentWithClass(toolbar, 'SpaceShowToolbar')
  })
})
