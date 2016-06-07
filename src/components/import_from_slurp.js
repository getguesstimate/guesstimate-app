import React, {Component} from 'react'
import {connect} from 'react-redux'

import {create} from 'gModules/spaces/actions'

import e from 'gEngine/engine'

@connect()
export class ImportFromSlurp extends Component {

  state = {
    value: ""
  }

  onSubmit() {
    const slurp = JSON.parse(this.state.value).SLURP
    const name = slurp.name
    const description = slurp.provenance

    let existingReadableIds = []
    const width = 8
    const metrics = _.map(slurp.SIP, (s,i) => {
      const metric = {
        ...e.metric.create(existingReadableIds),
        location: {row: Math.floor(i/width), column: i % width},
        name: s.name,
      }
      existingReadableIds.concat(metric.readableId)
      return metric
    })
    const guesstimates = _.map(slurp.SIP, (s,i) => ({
      description: s.provenance,
      guesstimateType: 'DATA',
      data: s.values,
      metric: metrics[i].id,
    }))

    const space = {name, description, graph: {metrics, guesstimates}}

    this.props.dispatch(create(null, space))
  }

  render() {
    return (
      <div className='ui form'>
        <div className='field'>
          <label>JSON Slurp</label>
          <textarea
            value={this.state.value}
            onChange={(e) => {this.setState({value: e.target.value})}}
          />
        </div>
        <div
          className='ui button submit blue'
          onClick={this.onSubmit.bind(this)}
        >
          Import
        </div>
      </div>
    )
  }
}
