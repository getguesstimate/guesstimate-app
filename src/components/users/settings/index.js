import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';
import './style.css'
import Icon from 'react-fa'
import Card from 'gComponents/utility/card/index.js'

function mapStateToProps(state) {
  return {
    me: state.me,
  }
}

@connect(mapStateToProps)
export default class Settings extends Component{
  displayName: 'Settings'

  _close() {
    console.log('hi')
  }

  render () {
    const {me} = this.props

    return (
      <div className='Settings'>
        <div className='ModalMedium'>
          <Card
            headerText={'Settings'}
            onClose={this._close.bind(this)}
            width={'normal'}
            hasPadding={true}
            shadow={true}
          >
            <div>
              <div className='Settings-Plan'>
                  <div className='Plan'>
                    <h2> Free Plan </h2>
                    <p> 0 Private Models </p>
                  </div>
              </div>
              <hr/>

              <div className='Settings-Upgrade'>
                <a className='ui button primary large'>
                  <Icon name='rocket'/>
                  {' Upgrade'}
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }
}
