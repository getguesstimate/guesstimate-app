import React from 'react'
import Estimate from './canvas-estimate'
import Funct from './canvas-funct'

const Guesstimate = React.createClass({
  type() {
    let guesstimate = this.props.guesstimate
    if (guesstimate.estimate !== undefined){
       return <Estimate estimate={guesstimate.estimate}/>
    } else if (guesstimate.funct !== undefined){
       return <Funct funct={guesstimate.estimate}/>
    }
  },
  render() {
    return (
    <div className="guesstimate">
      {this.type()}
    </div>
    )
  }
})

module.exports = Guesstimate;
