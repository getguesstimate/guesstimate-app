'use strict';
import React, {Component, PropTypes} from 'react'
let upto = (n) => Array.apply(null, {length: n}).map(Number.call, Number)

export default class HorizontalIndex extends Component{
  static propTypes = {
    columnCount: PropTypes.object.isRequired
  }

  render() {
    return (
        <div className='FlowGridRow--Horizontal-Index'>
          <span className='corner'></span>
          {
              upto(this.props.columnCount).map((column) => {
                return (
                    <div className='Element'>
                      {column + 1}
                    </div>
                  )
              })
          }
        </div>
    )
  }
}
