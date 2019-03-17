import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import { connect } from 'react-redux';
import './style.css'
import Icon from 'react-fa'
import * as displayErrorActions from 'gModules/displayErrors/actions.js'

function mapStateToProps(state) {
  return {
    displayError: state.displayError
  }
}

@connect(mapStateToProps)
export default class ErrorModal extends Component {

  _closeModal() {
    this.props.dispatch(displayErrorActions.close())
  }

  render() {
    const customStyles = {
      overlay: {
        backgroundColor: 'rgba(55, 68, 76, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      content : {
        maxWidth      : '50%',
        position: 'initial',
        backgroundColor     : 'rgba(0,0,0,0)',
        border: 'none',
        padding: '0'
      }
    };

    const isOpen = this.props.displayError && (this.props.displayError.length !== 0)
    return(
      <Modal
        isOpen={isOpen}
        onRequestClose={this._closeModal.bind(this)}
        style={customStyles}
      >
      {isOpen &&
        <div className='ErrorModal ui standard modal transition visible active'>
          <div className="header">
            <Icon name='warning'/> Website Error!
          </div>
          <div className="content">
            <div className="description">
              <div className="ui header">Try refreshing the browser.</div>
              <p>An error report was sent to Ozzie.  He'll work to fix it shortly.</p>
            </div>
          </div>
          <div className="actions">
            <div
                className="ui black deny button"
                onClick={this._closeModal.bind(this)}
            >
              Close
            </div>
          </div>
        </div>
      }
      </Modal>
    )
  }
}
