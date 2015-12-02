import React, {Component, PropTypes} from 'react';
import numeral from 'numeral'
import numberShow from 'lib/numberShower/numberShower.js'
import './style.css'

import _ from 'lodash'
import ShowIf from 'gComponents/utility/showIf';

function formatStat(n){
  if (n) {
    let value = parseFloat(n);
    return numberShow(value);
  }
}

class PrecisionNumber extends Component {
  render (){
    const number = numberShow(parseFloat(this.props.value))
    return (
      <span>
        {number.value}{number.symbol}
        {number.power && (<span>{`\u00b710`}<sup>{number.power}</sup></span>)}
      </span>
    )
  }
}

const Uncertainty = ({range}) => (
  <span className='stdev'> {'±'} <PrecisionNumber value={range}/> </span>
)

@ShowIf
class DistributionSummarySmall extends Component{
  static propTypes = {
    stats: PropTypes.object,
  }
  render () {
    let stats = this.props.stats;
    let {mean, stdev, percentiles} = stats
    let range = null
    if (_.isObject(percentiles)){ range = (percentiles[95] - mean)}
    return (
      <div className="DistributionSummary">
        <PrecisionNumber value={mean}/>
          {!!range && range !== 0 &&
          <Uncertainty range={range} />
          }
      </div>
    )
  }
}

export default class DistributionSummary extends Component{
  static propTypes = {
    simulation: PropTypes.object,
  }

  shouldComponentUpdate(newProps) {
    return (_.get(this.props, 'simulation.stats') !== _.get(newProps, 'simulation.stats'))
  }

  stats(){
    return _.get(this.props.simulation, 'stats') || false
  }
  render () {
    return (
      <DistributionSummarySmall
          showIf={_.isFinite(_.get(this.stats(), 'mean'))}
          stats={this.stats()}
      />
    )
  }
};

