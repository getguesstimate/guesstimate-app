import React, {Component, PropTypes} from 'react'
import JSONTree from 'react-json-tree'
import './style.css'

export default class ComponentEditor extends Component {
  static propTypes = {
    childProps: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    backgroundColor: PropTypes.string
  }

  static defaultProps = {
    backgroundColor: 'white'
  }

  render() {
    let className = `row ComponentEditor ${this.props.backgroundColor}`
    return (
      <div className={className} >
        <div className='col-sm-2 reference'>
          <h3> {this.props.name} </h3>
          <h4> {this.props.context} </h4>
          <JSONTree data={this.props.childProps}/>
        </div>
        <div className='col-sm-10 Component'>
          {<this.props.child {...this.props.childProps}/>}
        </div>
      </div>
    )
  }
}

