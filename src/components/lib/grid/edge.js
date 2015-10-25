import React, {Component, PropTypes} from 'react'
import _ from 'lodash'

//const isVertical = dd
class Rectangle {
  constructor(locations){
    this.left = locations.left
    this.right = locations.right
    this.top = locations.top
    this.bottom = locations.bottom
  }

  _xMiddle() { return (this.left + ((this.right - this.left)/2)) }
  _yMiddle() {  return (this.top + ((this.bottom - this.top)/2)) }

  topPoint() { return {x: this._xMiddle(), y: this.top} }
  bottomPoint() { return {x: this._xMiddle(), y: this.bottom} }
  leftPoint() { return {x: this.left, y: this._yMiddle()} }
  rightPoint() { return {x: this.right, y: this._yMiddle()} }

  positionFrom(otherRectangle) {
    const sameRow = (Math.abs(otherRectangle.top - this.top) < 200)
    if (sameRow) {
      if (this.right > otherRectangle.right) {
        return 'ON_LEFT'
      } else {
        return 'ON_RIGHT'
      }
    } else {
      if (this.top > otherRectangle.top) {
        return 'ON_TOP'
      } else {
        return 'ON_BOTTOM'
      }
    }
  }

  showPosition(otherRectangle) {
    const positionFrom = this.positionFrom(otherRectangle)
    switch (positionFrom) {
    case 'ON_LEFT':
      return this.leftPoint()
    case 'ON_RIGHT':
      return this.rightPoint()
    case 'ON_TOP':
      return this.topPoint()
    case 'ON_BOTTOM':
      return this.bottomPoint()
    }
  }
}

export default class Edge extends Component{
  displayName: 'Edge'

  static propTypes = {
    input: PropTypes.object.isRequired,
    output: PropTypes.object.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    return (!_.isEqual(this.props !== nextProps))
  }

  render() {
    const {output, input} = this.props;
    const inputPoints = (new Rectangle(input)).showPosition(output)
    const outputPoints = (new Rectangle(output)).showPosition(input)
    let points = null

    //const points = `${input.left},${input.top} ${input.right},${input.top} ${input.right},${input.bottom} ${input.left},${input.bottom}`
    points = `M${inputPoints.x},${inputPoints.y} L${outputPoints.x-2} ,${outputPoints.y-2}`

    //if (inputPoints.y == outputPoints.y){
      //points = `M${inputPoints.x},${inputPoints.y} L${outputPoints.x},${outputPoints.y}`
    //} else {
      //if (inputPoints.y > outputPoints.y) {
        //points = `M${inputPoints.x},${inputPoints.y} L${inputPoints.x},${inputPoints.y - 2} L${outputPoints.x},${inputPoints.y - 2} L${outputPoints.x},${outputPoints.y}`
      //} else {
        //points = `M${inputPoints.x},${inputPoints.y} L${inputPoints.x},${inputPoints.y + 2} L${outputPoints.x},${inputPoints.y + 2} L${outputPoints.x},${outputPoints.y}`
      //}
    //}

    return (
        <path
            className='basic-arrow'
            d={points}
            strokeWidth="3"
            markerEnd='url(#markerArrow)'
            fill="none"
        />
    )
  }
}
