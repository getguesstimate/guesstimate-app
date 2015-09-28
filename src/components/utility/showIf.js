import React, {Component} from 'react'

const ShowIf = (ComposedComponent) => class extends Component {
  element () {
    return (<ComposedComponent {...this.props}/>)
  }
  render() {
    if (this.props.showIf){ return this.element() }
    else { return false  }
  }
};

export default ShowIf
