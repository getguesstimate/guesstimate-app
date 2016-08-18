import React, {Component, PropTypes} from 'react'
import Modal from 'react-modal'

export class GeneralModal extends Component {
  render() {
    const customStyles = {
      overlay: {
        backgroundColor: 'rgba(55, 68, 76, 0.4)'
      },
      content: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
        border: 'none',
        padding: '0px'
      }
    }
    return (
      <Modal
        isOpen={true}
        onRequestClose={this.props.onRequestClose}
        style={customStyles}
      >
        {this.props.children}
      </Modal>
    );
  }
}
