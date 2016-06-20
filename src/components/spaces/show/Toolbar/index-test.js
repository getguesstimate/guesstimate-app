import React from 'react'
import TestUtils from 'react-addons-test-utils'
import {shallow} from 'enzyme'
import {TestRoot} from 'gComponents/rootTestComponent'

import {SpaceToolbar} from './index'

describe('<SpaceToolbar>', () => {
  it ('renders the view form', () => {
    const toolbar = shallow(<SpaceToolbar />)
    expect(toolbar.find('.SpaceShowToolbar')).to.have.length(1)
  })
})
