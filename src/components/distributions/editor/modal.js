import React, {Component, PropTypes} from 'react'
import Modal from 'react-modal'
import Form from './index'

export default class DistributionEditorModal extends Component {
  shouldComponentUpdate(nextProps) {
    return (nextProps.isOpen || this.props.isOpen)
  }

  render() {
    const customStyles = {
      overlay: {
        backgroundColor: 'rgba(55, 68, 76, 0.6)'
      },
      content : {
        top                   : '20%',
        left                  : '20%',
        right                  : '100%',
        bottom                  : '100%',
        padding                  : '0',
        border                  : 'none',
        overflow: 'none',
        outline: 'none'
      }
    };
    const {isOpen, closeModal, onSubmit} = this.props
    return(
      <Modal
          isOpen={isOpen}
          onRequestClose={closeModal}
          style={customStyles}
      >
      {isOpen &&
        <Form
            close={closeModal}
            onSubmit={onSubmit}
            guesstimate={this.props.guesstimate}
        />
      }
      </Modal>
    )
  }
}
