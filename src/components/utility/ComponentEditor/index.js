import React, {Component, PropTypes} from 'react'
import JSONTree from 'react-json-tree'
import './style.css'

export default class ComponentEditor extends Component {
  static propTypes = {
    child: PropTypes.object.isRequired,
    childProps: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
  }

  render() {
    return (
    <div className='row ComponentEditor'>
      <div className='col-sm-2'>
        <h2> {this.props.name} </h2>
        <JSONTree data={this.props.childProps}/>
      </div>
      <div className='col-sm-10 Component'>
        {<this.props.child {...this.props.childProps}/>}
      </div>
    </div>
    )
  }
}

