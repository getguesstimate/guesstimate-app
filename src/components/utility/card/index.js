import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'
import Icon from 'react-fa'
import {ButtonClose} from 'gComponents/utility/buttons/close/index.js'
import './style.css'

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

export const CardListElement = ({icon, image, header, children, url, onMouseDown, isSelected}) => (
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
          <div className='col-xs-7 info-section'>
            <span className='header'>{header.capitalizeFirstLetter()}</span>
            {children}
          </div>
      </div>
    </a>
  </li>
)

export default class Card extends Component {
  displayName: 'Card'

  static propTypes = {
    headerText: PropTypes.string,
    width: PropTypes.string,
    hasPadding: PropTypes.bool,
    onClose: PropTypes.func,
    shadow: PropTypes.bool
  }

  _cardClass() {
    let klass = `Card ${this.props.width}`
    klass += this.props.shadow ? ' shadow' : ''
    return klass
  }

  _bodyClass() {
    let klass = 'Card-body'
    klass += this.props.hasPadding ? ' padded' : ''
    return klass
  }

  render() {
    const {headerText, onClose, width} = this.props
    return (
      <div className={this._cardClass()}>
        {headerText &&
          <div className='Card-header'>
            <h3> {headerText} </h3>
            <span className='Card-close'><ButtonClose onClick={onClose}/></span>
          </div>
        }

        <div className={this._bodyClass()}>
          {headerText &&
            <hr/>
          }
          {this.props.children}
        </div>
      </div>
    )
  }
}
