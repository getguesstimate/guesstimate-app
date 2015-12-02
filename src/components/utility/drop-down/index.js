import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import Icon from 'react-fa'
import './style.css'


String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

export const DropDownListElement = ({icon, image, text, url, onMouseDown, isSelected}) => (
  <li>
    <a className={'action' + (isSelected ? ' selected' : '')} href={url} onMouseDown={onMouseDown}>
      <div className='row middle-xs'>
        <div className='col-xs-3 icons'>
          {icon &&
            <Icon name={icon}/>
          }
          {image &&
            <img src={image}/>
          }
        </div>
        <div className='col-xs-7 text .middle-xs'>
          {text.capitalizeFirstLetter()}
        </div>
      </div>
    </a>
  </li>
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

  _bodyClass() {
    let klass = 'dropDown-body'
    klass += this.props.hasPadding === true ? ' padded' : ''
    return klass
  }

  render() {
    const {headerText} = this.props

    let dropDownClass = 'dropDown'

    return (
      <span className='dropDown-relative'>
        <span className={'dropDown-open'} onClick={this._toggle.bind(this)}>
          {this.props.openLink}
        </span>
        {this.state.isOpen &&
          <div className={this._dropDownClass()}>
            <div className='dropDown-content'>
              <div className='dropDown-header'>
                <h3> {headerText} </h3>
                <a className='dropDown-close' onClick={this._close.bind(this)}>
                  <Icon name='close'/>
                </a>
              </div>

              <div className={this._bodyClass()}>
                <hr/>
                {this.props.children}
              </div>
            </div>
          </div>
        }
      </span>
    )
  }
}
