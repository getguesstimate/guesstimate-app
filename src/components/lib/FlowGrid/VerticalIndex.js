'use strict';
import React, {Component, PropTypes} from 'react'
let upto = (n) => Array.apply(null, {length: n}).map(Number.call, Number)

export default class VerticalIndex extends Component{
  static propTypes = {
    rowHeights: PropTypes.array.isRequired
  }

  render() {
    const {rowHeights} = this.props
    return (
        <div className='FlowGridRow--Vertical-Index'>
          {
              upto(this.props.rowHeights.length).map((row) => {
                const style = {height: rowHeights[row]}
                return (
                    <div className='Element' style={style}>
                    {row + 1}
                    </div>
                  )
              })
          }
        </div>
    )
  }
}
