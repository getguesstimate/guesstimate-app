import React, {Component, PropTypes} from 'react'
import StandardDropdownMenu from 'gComponents/utility/standard-dropdown-menu'
import Icon from 'react-fa'

export default class CanvasShowHeader extends Component {
  render() {
    const {space} = this.props;
    return (
      <div className='item action'>
        <StandardDropdownMenu toggleButton={<a><Icon name='cog'/> Settings </a>}>
            <li key='1' onMouseDown={this.props.onDestroy}><button type='button'>Delete</button></li>
        </StandardDropdownMenu>

        {space.busy ?
          <a> {'saving...'}  </a>
          :
          <a onClick={this.props.onSave}>
            <Icon name='save'/> {'Save'}
          </a>
        }

      </div>
    )
  }
}

