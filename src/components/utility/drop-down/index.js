import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import Icon from 'react-fa'
import './style.css'
import {CardListElement} from 'gComponents/utility/card/index.js'
import Card from 'gComponents/utility/card/index.js'

export const DropDownListElement = ({icon, image, text, url, onMouseDown, isSelected}) => (
  <CardListElement icon={icon} image={image} text={text} url={url} onMouseDown={onMouseDown} isSelected={isSelected}/>
)

export default class DropDown extends Component {
  displayName: 'DropDown'

  static propTypes = {
    headerText: PropTypes.string.isRequired,
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
  }

  _close() {
    this.setState({isOpen: false})
    document.removeEventListener('click', this.handleDocumentClick, false);
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
