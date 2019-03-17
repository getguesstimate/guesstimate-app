import React, {Component} from 'react' 
import PropTypes from 'prop-types'
import Icon from'react-fa'

export default class Maintenance extends Component{
  displayName: 'Maintenance'
  render () {
    return (
      <div>
        <br/>
        <br/>

        <div className='ui message'>
          <h1>
            Maintenance Mode
          </h1>
          <p>
            Guesstimate has gone down for maintenance. We'll be back in 10 to 30 minutes with 90% confidence.
          </p>
        </div>
      </div>
    )
  }
}
