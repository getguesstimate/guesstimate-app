import React, {Component, PropTypes} from 'react'
import './style.css'

export default class Main extends Component{
  displayName: 'Main'

  static defaultProps = {
    isFluid: false
  }

  render() {
    const {children, isFluid, backgroundColor} = this.props
    let className = ''
    className += (backgroundColor === 'BLUE') ? ' blue' : ''
    className += isFluid ? ' flexed' : ''

    if (isFluid) {
      return (
        <main className={className}>
          {children}
        </main>
      )
    } else {
      return (
        <main className={className}>
          <div className='container-fluid wrap'>
            {children}
          </div>
        </main>
      )
    }
  }
}
