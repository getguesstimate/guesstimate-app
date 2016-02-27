import React, {Component, PropTypes} from 'react'
import JSONTree from 'react-json-tree'
import './style.css'

export default class ComponentEditor extends Component {
  static propTypes = {
    childProps: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div className='row ComponentEditor'>
        <div className='col-sm-2'>
          <JSONTree data={this.props.childProps}/>
        </div>
        <div className='col-sm-10 Component'>
          {<this.props.child {...this.props.childProps}/>}
        </div>
      </div>
    )
  }
}

