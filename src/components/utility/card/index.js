import React, {Component, PropTypes} from 'react'
import ReactDOM from 'react-dom'

import Icon from 'react-fa'

import {ButtonClose} from 'gComponents/utility/buttons/close/index.js'

import './style.css'

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

export const CardListSection = ({children}) => (
  <div className='CardListSection'>
    {children}
  </div>
)

export class CardListElement extends Component {
  static propTypes = {
    imageShape: PropTypes.oneOf(['circle', 'square']),
  }

  static defailtProps = {
    imageShape: 'square'
  }

  _onSelect() {
    const {isSelected, isDisabled} = this.props
    if ((!isSelected) && (!isDisabled)) {
      this.props.onMouseDown()
    }
  }

  render() {
    const {icon, ionicIcon, image, imageShape, header, children, url, isSelected, isDisabled} = this.props

    let className = 'action'
    if (isSelected) { className += ' selected' }
    if (isDisabled) { className += ' disabled' }
    if (!!children) { className += ' hasChildren' }

    let [small, large] = !!children ? ['2', '10'] : ['3', '9']

    const hasImage = !!icon || !!ionicIcon || !!image

    return (
      <li>
        <a
          className={className}
          href={url}
          onMouseDown={this._onSelect.bind(this)}
        >
          <div className='row middle-xs'>
            {hasImage &&
              <IconSection {...{icon, ionicIcon, image, imageShape}} colCount={small} />
            }
            <ChildrenSection {...{header, children}} colCount={hasImage ? large : '12'}/>
          </div>
        </a>
      </li>
    )
  }
}

const IconSection = ({colCount, icon, ionicIcon, image, imageShape}) => (
  <div className={`col-xs-${colCount} icons`}>
    {icon && <Icon name={icon}/>}
    {ionicIcon && <i className={`ion-${ionicIcon}`}/>}
    {image && <img src={image} className={imageShape}/>}
  </div>
)

const ChildrenSection = ({colCount, header, children}) => (
  <div className={`col-xs-${colCount} info-section`}>
    {!!header && <span className='header'>{header.capitalizeFirstLetter()}</span>}
    {!!children &&
      <div className='content'> {children} </div>
    }
  </div>
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
