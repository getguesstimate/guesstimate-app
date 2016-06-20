import React from 'react'
import TestUtils from 'react-addons-test-utils'
import {TestRoot} from 'gComponents/rootTestComponent'

import {SpaceToolbar} from './index'

describe('<SpaceToolbar>', () => {
  it ('renders the view form', () => {
    const toolbar = TestUtils.renderIntoDocument(
      <TestRoot>
        <SpaceToolbar />
      </TestRoot>
    )

    TestUtils.findRenderedDOMComponentWithClass(toolbar, 'SpaceShowToolbar')
  })
})
