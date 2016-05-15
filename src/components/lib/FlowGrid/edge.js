import React, {Component, PropTypes} from 'react'
import _ from 'lodash'
import angleBetweenPoints from 'angle-between-points'

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

  topPoint(adjust) { return {x: this._xMiddle() + adjust, y: this.top} }
  bottomPoint(adjust) { return {x: this._xMiddle() + adjust, y: this.bottom} }
  leftPoint(adjust) { return {x: this.left, y: this._yMiddle() + adjust} }
  rightPoint(adjust) { return {x: this.right, y: this._yMiddle() + adjust} }

  angleTo(otherRectangle) {
    const other = new Rectangle(otherRectangle)
    const points = [
      {x: (this._xMiddle()), y: (-1 * this._yMiddle())},
      {x: (other._xMiddle()), y: (-1 * other._yMiddle())}
    ]
    return angleBetweenPoints(...points)
  }

  positionFrom(otherRectangle) {
    const angle = this.angleTo(otherRectangle)

    const RECTANGLE_ANGLE = 30
    // this is 45 for a perfect square
    //
    if (angle < RECTANGLE_ANGLE) {
      return 'ON_RIGHT'
    } else if (angle < (180 - RECTANGLE_ANGLE)) {
      return 'ON_TOP'
    } else if (angle < (180 + RECTANGLE_ANGLE)) {
      return 'ON_LEFT'
    } else if (angle < (360 - RECTANGLE_ANGLE)) {
      return 'ON_BOTTOM'
    } else {
      return 'ON_RIGHT'
    }
  }

  adjustment(otherRectangle) {
    return this.shouldAdjust(otherRectangle) ? this.adjustmentAmount(otherRectangle) : 0
  }

  shouldAdjust(otherRectangle) {
    const angle = this.angleTo(otherRectangle)
    return (((angle) % 90) < 4)
  }

  //this randomness really messes up with rendering, will stop for now
  adjustmentAmount(otherRectangle) {
    const ADJUSTMENT_RANGE = 20
    return (Math.random() * ADJUSTMENT_RANGE) - (ADJUSTMENT_RANGE / 2)
  }

  showPosition(otherRectangle) {
    const positionFrom = this.positionFrom(otherRectangle)
    const adjust = 0
    switch (positionFrom) {
    case 'ON_LEFT':
      return this.leftPoint(adjust)
    case 'ON_RIGHT':
      return this.rightPoint(adjust)
    case 'ON_TOP':
      return this.topPoint(adjust)
    case 'ON_BOTTOM':
      return this.bottomPoint(adjust)
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

  _isValidNode({top, left, right, bottom}) {
    return _.every([top, left, right, bottom], _.isFinite)
  }

  render() {
    const {output, input, color} = this.props;
    if (!this._isValidNode(input) || !this._isValidNode(output)) { return (false) }
    let inputPoints = (new Rectangle(input)).showPosition(output)
    let outputPoints = (new Rectangle(output)).showPosition(input)

    let points = `M${inputPoints.x},${inputPoints.y} L${outputPoints.x} ,${outputPoints.y}`

    return (
        <path
            className={`basic-arrow ${color}`}
            d={points}
            markerEnd={`url(#MarkerArrow${color})`}
            fill="none"
        />
    )
  }
}
