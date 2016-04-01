import React, {Component, PropTypes} from 'react'
import app from 'ampersand-app'
import ReactDOM from 'react-dom'
import Icon from 'react-fa'
import './style.css'
import {CardListElement} from 'gComponents/utility/card/index.js'
import Card from 'gComponents/utility/card/index.js'

export class DropDownListElement extends Component {

  static propTypes = {
    icon: PropTypes.string,
    image: PropTypes.string,
    header: PropTypes.string.isRequired,
    isSelected: PropTypes.bool,
    onMouseDown: PropTypes.func,
    closeOnClick: PropTypes.bool,
    dropDown: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ])
  }

  static defaultProps = {
    closeOnClick: false,
    dropDown: false
  }

  _onMouseDown() {
    //debugger
    if (this.props.closeOnClick && !!this.props.dropDown) {this.props.dropDown._close() }
    this.props.onMouseDown()
  }

  render() {
    const {icon, ionicIcon, image, header, isSelected, children} = this.props
    return (
      <CardListElement icon={icon} ionicIcon={ionicIcon} image={image} header={header} isSelected={isSelected} onMouseDown={this._onMouseDown.bind(this)}>
        {children}
      </CardListElement>
    );
  }
}

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
      this.setState({isOpen:false});
    }
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
              {this.props.children}
            </Card>
          </div>
        }
      </span>
    )
  }
}
