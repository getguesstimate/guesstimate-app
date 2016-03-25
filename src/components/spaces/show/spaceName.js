import React, {Component, PropTypes} from 'react'
import StandardDropdownMenu from 'gComponents/utility/standard-dropdown-menu'
import CanvasViewForm from './canvasViewForm.js'
import Icon from 'react-fa'

import DropDown from 'gComponents/utility/drop-down/index.js'
import {DropDownListElement} from 'gComponents/utility/drop-down/index.js'

export class SpaceName extends Component {
  onSave() {
    this.refs.DropDown._close()
    const name = this.refs.name.value
    this.props.onSave(name)
  }

  render () {
    let {editableByMe, name} = this.props
    const hasName = !_.isEmpty(name)
    const className = `text-editable ${hasName ? '' : 'default-value'}`
    const showName = hasName ? name : 'Untitled Model'
    return(
      <span>
        {editableByMe &&
          <DropDown
              headerText={'Rename Model'}
              openLink={<h1 className={className}> {showName} </h1>}
              position='right'
              hasPadding={true}
              width='wide'
              ref='DropDown'
          >
          <div className='ui form'>
            <h2> Name </h2>
            <textarea
              defaultValue={name}
              type='text'
              rows='2'
              ref='name'
            />
            <div className='ui button primary large' onClick={this.onSave.bind(this)}>
                Rename
            </div>
          </div>
          </DropDown>
        }
        {!editableByMe &&
          <h1> {name} </h1>
        }
      </span>
    )
  }
}

