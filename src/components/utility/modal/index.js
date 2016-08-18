import React, {Component, PropTypes} from 'react'
import Modal from 'react-modal'

        //display: 'flex',
        //alignItems: 'center',
        //justifyContent: 'center',
        //backgroundColor: 'rgba(0,0,0,0)',
        //border: 'none',
        //padding: '0px',
        //top: 0,
        //left: 0,
        //right: 0,
        //bottom: 0,
export class GeneralModal extends Component {
  render() {
    const customStyles = {
      overlay: {
        backgroundColor: 'rgba(55, 68, 76, 0.4)'
      },
      content: {
        position: 'absolute',
        top: '6%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        border: 'none',
        padding: '0px',
        transform: 'translateX(-50%)',
        marginRight: '-50%',
        marginBottom: '2em',
        backround: 'rgba(0,0,0,0)',
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
