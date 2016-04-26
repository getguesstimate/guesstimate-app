import React, {Component, PropTypes} from 'react';
import numeral from 'numeral'
import numberShow from 'lib/numberShower/numberShower.js'
import './style.css'
import ShowIf from 'gComponents/utility/showIf';

function formatStat(n){
  if (n) {
    let value = parseFloat(n);
    return numberShow(value);
  }
}

const PrecisionNumber = ({value, precision}) => {
  const number = numberShow(value, precision)
  return (
    <span>
      {number.value}{number.symbol}
      {number.power && (<span>{`\u00b710`}<sup>{number.power}</sup></span>)}
    </span>
  )
}

const UncertaintyRange = ({low, high}) => (
  <div className='UncertaintyRange'>
    <PrecisionNumber value={low}/> to <PrecisionNumber value={high}/>
  </div>
)

@ShowIf
class DistributionSummarySmall extends Component{
  static propTypes = {
    stats: PropTypes.object,
  }
  render () {
    const {length, mean, stdev, adjustedPercentiles} = this.props.stats

    let range = null
    let low = null
    let high = null
    if (_.isObject(adjustedPercentiles)) {
      [low, high] = [adjustedPercentiles[5], adjustedPercentiles[95]]
    }

    const precision = length === 1 ? 6 : 2
    return (
      <div className="DistributionSummary">
        <div className='mean'>
        <PrecisionNumber value={parseFloat(mean)} precision={precision}/>
        </div>
        {!!low && !!high && high*low !== 0 &&
          <UncertaintyRange low={low} high={high} />
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

