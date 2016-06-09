import React, {Component} from 'react'
import {connect} from 'react-redux'

import {ImportFromSlurpForm} from './import_from_slurp_form'

import {create} from 'gModules/spaces/actions'

import {parseSlurp} from 'lib/slurpParser'

import e from 'gEngine/engine'

@connect()
export class ImportFromSlurp extends Component {
  onImport(slurp) {
    const spaceParams = parseSlurp(slurp)
    const space = {
      ..._.pick(spaceParams, ['name', 'description']),
      graph: {metrics: spaceParams.newMetrics, guesstimates: spaceParams.newGuesstimates}
    }
    this.props.dispatch(create(null, space))
  }

  render() {
    return (
      <ImportFromSlurpForm onSubmit={this.onImport.bind(this)} />
    )
  }
}
