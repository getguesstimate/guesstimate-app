import React, {Component} from 'react'

import {SmallDataViewer, LargeDataViewer} from './DataViewer'

export default class DataForm extends Component{
  _handleDelete() { this.props.onSave({guesstimateType: null, data: null, input: null}, true) }
  _handleSave(data) { this.props.onSave({guesstimateType: 'DATA', data, input: null}, true) }

  render() {
    const {size, data, onOpen} = this.props
    const isLarge = (size === 'large')
    return (
      <div>
        {!isLarge &&
          <SmallDataViewer
            onDelete={this._handleDelete.bind(this)}
            onOpen={onOpen}
          />
        }
        {isLarge &&
          <div className='row'>
            <div className='col-sm-12'>
              <LargeDataViewer
                data={data}
                onDelete={this._handleDelete.bind(this)}
                onSave={this._handleSave.bind(this)}
              />
            </div>
          </div>
        }
      </div>
    )
  }
}
