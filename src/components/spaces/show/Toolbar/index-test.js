import React from 'react'
import Icon from 'react-fa'

import {shallow, mount} from 'enzyme'
import {TestRoot} from 'gComponents/rootTestComponent'
import DropDown from 'gComponents/utility/drop-down/index'

import {SpaceToolbar} from './index'

import CanvasViewForm from '../canvasViewForm'

/*
      <SpaceToolbar
        editableByMe={}
        actionState={}
        isLoggedIn={}
        onCopyModel={}
        onCopyMetrics={}
        onPasteMetrics={}
        onCutMetrics={}
        onDestroy={}
        onUndo={}
        canUndo={}
        onRedo={}
        canRedo={}
        editsAllowed={}
        onAllowEdits={}
        onForbidEdits={}
      />
      */

describe('<SpaceToolbar>', () => {
  it ('Always shows the view form', () => {
    const toolbar = shallow(<SpaceToolbar />)
    expect(toolbar.containsMatchingElement(<CanvasViewForm/>)).to.equal(true)
  })

  it ('Disables the undo/redo buttons when they are unavailable', () => {
    const toolbar = shallow(
      <SpaceToolbar
        canUndo={false}
        canRedo={false}
      />
    )
    expect(toolbar.find('.header-action')).to.have.length(5)
    expect(toolbar.find('.header-action.disabled')).to.have.length(2)
  })

  it ('Renders the file menu if you are logged in', () => {
    let toolbar = shallow(<SpaceToolbar isLoggedIn={false} />)
    expect(toolbar.containsMatchingElement(
      <DropDown openLink={<a className='header-action'>File</a>} />
    )).to.equal(false)

    let toolbar = shallow(<SpaceToolbar isLoggedIn={true} />)
    expect(toolbar.containsMatchingElement(
      <DropDown openLink={<a className='header-action'>File</a>} />
    )).to.equal(true)
  })
})
