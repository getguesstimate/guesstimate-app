import React, {Component} from 'react'

import {ButtonClose} from 'gComponents/utility/buttons/close/index'
import {TutorialPageOne, TutorialPageTwo, TutorialPageThree, TutorialPageFour} from './pages'

import Icon from 'react-fa'
import Modal from 'react-modal'

import './style.css'

export const TutorialModal = ({onClose}) => {
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(55, 68, 76, 0.4)'
    },
    content : {
      left: '25%',
      width: '50%',
      right: 'auto',
      top: '5%',
      height: '40em',
      bottom: 'auto',
      marginRight: '-50%',
      backgroundColor: '#F0F0F0',
      border: 'none',
      padding: '1em',
    }
  }
  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      style={customStyles}
    >
      <Tutorial onClose={onClose} />
    </Modal>
  )
}

class Tutorial extends Component {
  static PAGES = [
    <TutorialPageOne />,
    <TutorialPageTwo />,
    <TutorialPageThree />,
    <TutorialPageFour />,
  ]

  state = {
    onPage: 0
  }

  previousPage() { this.setState({onPage: Math.max(this.state.onPage - 1, 0)}) }
  nextPage() { this.setState({onPage: Math.min(this.state.onPage + 1, 4)}) }
  renderPage() { return Tutorial.PAGES[this.state.onPage] }

  render() {
    return (
      <div
        className='tutorial'
        onKeyDown={(e) => {if (e.keyCode === 13) { this.props.onClose() }} }
      >
        {false && <div className='header'>
          <div className='row'>
            <div className='col-md-11'><h2>{this.header()}</h2></div>
            <div className='col-md-1'><ButtonClose onClick={this.props.onClose}/></div>
          </div>
        </div>}
        {this.renderPage()}
        <div className='action-container'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='actions'>
                <span className='progress'> {this.state.onPage + 1} / 4 </span>
                <span
                  className={`ui button ${this.state.onPage === 0 ? 'disabled' : ''}`}
                  onClick={this.previousPage.bind(this)}
                >
                  <Icon name='arrow-left'/> Previous
                </span>
                <span
                  className={`ui button ${this.state.onPage === 3 ? 'disabled' : ''}`}
                  onClick={this.nextPage.bind(this)}
                >
                  <Icon name='arrow-right'/> Next
                </span>
                <span
                  className='ui button'
                  onClick={this.props.onClose}
                >
                  Exit
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
