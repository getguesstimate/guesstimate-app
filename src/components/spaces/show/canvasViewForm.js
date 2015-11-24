import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import DropDown from 'gComponents/utility/drop-down/index.js'
import {DropDownListElement} from 'gComponents/utility/drop-down/index.js'
import './style.css'
import Icon from 'react-fa'

export default class CanvasViewForm extends Component {
  displayName: 'CanvasViewForm'

  static propTypes = {
  }

  render () {
    return (
      <DropDown
          headerText={'View Options'}
          openLink={<a className='relative'>View Options</a>}
      >
        <div className='header-divider'>
          <h2> Metric Style </h2>
        </div>
        <ul>
          <DropDownListElement key='2' icon='plus' text='Normal' isSelected='true'/>
          <DropDownListElement key='1' icon='plus' text='Basic'/>
          <DropDownListElement key='3' icon='plus' text='Scientific'/>
          <DropDownListElement key='4' icon='plus' text='Debugging'/>
        </ul>

        <div className='header-divider'>
          <h2> Arrows </h2>
        </div>
        <ul>
          <DropDownListElement key='5' icon='plus' text='Hidden'/>
          <DropDownListElement key='6' icon='plus' text='Shown' isSelected='true'/>
        </ul>
      </DropDown>
    )
  }
}
