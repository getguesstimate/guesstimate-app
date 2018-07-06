import React, {Component} from 'react'

import Icon from 'react-fa'

import {ButtonClose} from 'gComponents/utility/buttons/close/index'
import {TutorialMetricPage, TutorialMetricActionsPage, TutorialFunctionPage, TutorialMoreFeaturesPage} from './pages'
import {GeneralModal} from 'gComponents/utility/modal/index'

import './style.css'

export class Tutorial extends Component {
  static PAGES = [
    <TutorialMetricPage/>,
    <TutorialFunctionPage/>,
    <TutorialMetricActionsPage/>,
    <TutorialMoreFeaturesPage/>,
  ]

  state = {
    onPage: 0
  }

  previousPage() {
    const onPage = Math.max(this.state.onPage - 1, 0)
    this.setState({onPage})
  }
  nextPage() {
    const onPage = Math.min(this.state.onPage + 1, 4)
    this.setState({onPage})
  }
  renderPage() {
    return Tutorial.PAGES[this.state.onPage]
  }

  render() {
    return (
      <GeneralModal
        onRequestClose={this.props.onClose}
      >
        <div
          className='Tutorial'
          onKeyDown={(e) => {if (e.keyCode === 13) { this.props.onClose() }} }
        >
          {this.renderPage()}
            <div className='row'>
              <div className='col-md-12 actions'>
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
                    Done
                  </span>
              </div>
            </div>
        </div>
    </GeneralModal>
    )
  }
}
