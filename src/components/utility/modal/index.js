import React from 'react'
import Modal from 'react-modal'

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

export const GeneralModal = ({onRequestClose, children}) => (
  <Modal
    isOpen={true}
    onRequestClose={onRequestClose}
    style={customStyles}
  >
    {children}
  </Modal>
)
