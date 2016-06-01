import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';

import Modal from 'react-modal'
import SettingsContainer from 'gComponents/users/settings/container.js'
import NavHelper from 'gComponents/utility/NavHelper/index.js';
import FirstSubscriptionContainer from 'gComponents/subscriptions/FirstSubscription/container.js'
import * as modalActions from 'gModules/modal/actions.js'

export default class Confirmation extends Component{
  render() {
    return (
      <div className='MainConfirmation'>
        <h1> {this.props.message} </h1>
        <button className='ui button primary large' onClick={this.props.onConfirm}> Confirm </button>
        <button className='ui button grey large' onClick={this.props.onClose}> Cancel </button>
      </div>
    )
  }
}

const routes = [
  {name: 'settings', component: SettingsContainer},
  {name: 'firstSubscription', component: FirstSubscriptionContainer},
  {name: 'confirmation', component: Confirmation}
]

function getComponent(componentName) {
  const component = routes.find(e => e.name === componentName)
  return component.component || false
}

export default class ModalRouter extends Component{
  render () {
    const {componentName, props} = this.props
    if (!componentName){ return false }
    else {
      const component = getComponent(componentName)
      let item = {component}

      const customStyles = {
        overlay: {
          backgroundColor: 'rgba(55, 68, 76, 0.6)',
          display: 'flex'
        },
        content : {
          position: 'initial',
          top: 'inherit',
          left: 'inherit',
          right: 'inherit',
          bottom: 'inherit',
          background: 'none',
          border: 'none',
          padding: 0,
          marginRight: 'auto',
          marginLeft: 'auto',
          marginTop: '14%'
        }
      };

      const isOpen = true
      return(
        <Modal
          isOpen={isOpen}
          onRequestClose={this.props.onClose}
          style={customStyles}
        >
          <NavHelper>
              {<item.component {...props} onClose={this.props.onClose}/>}
          </NavHelper>
        </Modal>
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    modal: state.modal
  }
}

@connect(mapStateToProps)
export default class ModalContainer extends Component{
  _close() {
    this.props.dispatch(modalActions.close())
  }
  render () {
    const {componentName, props} = this.props.modal
    return (
      <ModalRouter
        componentName={componentName}
        props={props}
        onClose={this._close.bind(this)}
      />
    )
  }
}
