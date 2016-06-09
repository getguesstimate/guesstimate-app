import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

import Card from 'gComponents/utility/card/index.js'

import './style.css'

export default class DropDown extends Component {
  displayName: 'DropDown'

  static propTypes = {
    headerText: PropTypes.string.isRequired,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
  }

  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen || false
    }

    this.handleDocumentClick = this.handleDocumentClick.bind(this)
  }

  handleDocumentClick(event) {
    if (!ReactDOM.findDOMNode(this).contains(event.target)) {
      this._close()
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleDocumentClick, false);
  }

  _open() {
    this.setState({isOpen: true})
    document.addEventListener('click', this.handleDocumentClick, false);
    if (this.props.onOpen) {this.props.onOpen()}
  }

  _close() {
    this.setState({isOpen: false})
    document.removeEventListener('click', this.handleDocumentClick, false);
    if (this.props.onClose) {this.props.onClose()}
  }

  _toggle() {
    this.state.isOpen ? this._close() : this._open()
  }

  _dropDownClass(){
    let klass = 'dropDown'
    klass += this.props.position === 'right' ? ' position-right' : ' position-left'
    klass += this.props.width === 'wide' ? ' wide' : ''
    return klass
  }

  render() {
    const {headerText} = this.props
    const width = this.props.width === 'wide' ? 'normal' : 'narrow'
    return (
      <span className='dropDown-relative'>
        <span className={'dropDown-open'} onClick={this._toggle.bind(this)}>
          {this.props.openLink}
        </span>
        {this.state.isOpen &&
          <div className={this._dropDownClass()}>
            <Card
              headerText={headerText}
              onClose={this._close.bind(this)}
              width={width}
              hasPadding={this.props.hasPadding}
              shadow={true}
            >
              {_.isArray(this.props.children) &&
                <ul>
                  {
                    _.map(this.props.children, (child, i) => {
                      if (child.props.closeOnClick) {
                        return (
                          <div onMouseDown={() => {this._close()}} key={i}> {child} </div>
                        )
                      } else {
                        return (
                          <div key={i}> {child} </div>
                        )
                      }
                    })
                  }
                </ul>
              }
              {!_.isArray(this.props.children) && this.props.children}
            </Card>
          </div>
        }
      </span>
    )
  }
}
