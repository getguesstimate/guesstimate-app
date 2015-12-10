import React from 'react'
import ReactDOM from 'react-dom'

const style = {
  padding: 0,
  border: 0
}

function defaultGetWidth (element) {
  return element.clientWidth
}

function defaultGetHeight (element) {
  return element.clientHeight
}

export default function Dimensions ({ getHeight = defaultGetHeight, getWidth = defaultGetWidth } = {}) {
  return (ComposedComponent) => {
    return class extends React.Component {
      // ES7 Class properties
      // http://babeljs.io/blog/2015/06/07/react-on-es6-plus/#property-initializers
      state = {}

      // Using arrow functions and ES7 Class properties to autobind
      // http://babeljs.io/blog/2015/06/07/react-on-es6-plus/#arrow-functions
      updateDimensions = () => {
        const container = ReactDOM.findDOMNode(this.refs.container)
        if (!container) {
          throw new Error('Cannot find container div')
        }
        this.setState({
          containerWidth: getWidth(container),
          containerHeight: getHeight(container)
        })
      }

      onResize = () => {
        if (this.rqf) return
        this.rqf = window.requestAnimationFrame(() => {
          this.rqf = null
          this.updateDimensions()
        })
      }

      componentDidMount () {
        this.updateDimensions()
        window.addEventListener('resize', this.onResize, false)
      }

      componentWillUnmount () {
        window.removeEventListener('resize', this.onResize)
      }

      render () {
        return (
          <div style={style} ref='container'>
            <ComposedComponent {...this.state} {...this.props}/>
          </div>
        )
      }
    }
  }
}
