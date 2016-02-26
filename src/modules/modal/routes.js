import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';

import SettingsContainer from 'gComponents/users/settings/container.js'
import * as modalActions from 'gModules/modal/actions.js'

const routes = [
  {name: 'settings', component: SettingsContainer}
]

function getComponent(componentName) {
  const component = routes.find(e => e.name === componentName)
  return component.component || false
}

export default class Modal extends Component{
  render() {
    return (
      <div>
        'begin modal'
        {this.props.children}
        'end modal'
      </div>
    )
  }
}

export default class ModalRouter extends Component{
  render () {
    const {componentName, props} = this.props
    if (!componentName){ return false }
    else {
      const component = getComponent(componentName)
      let item = {component}
      return (
        <Modal>
          {<item.component {...props} onClose={this.props.onClose}/>}
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
