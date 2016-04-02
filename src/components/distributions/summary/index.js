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

const NinetyPercentCI = ({low, high}) => (
  <span className='stdev asymmetric'> <PrecisionNumber value={low}/>:<PrecisionNumber value={high}/> </span>
)

const AsymmetricUncertainty = ({lowDelta, highDelta}) => (
  <div className='stdev asymmetric'>
    <div className='pm'>
      <div>-<PrecisionNumber value={lowDelta}/></div>
      <div>+<PrecisionNumber value={highDelta}/></div>
    </div>
  </div>
)

const Uncertainty = ({range}) => (
  <span className='stdev'> {'±'} <PrecisionNumber value={range}/> </span>
)

@ShowIf
class DistributionSummarySmall extends Component{
  static propTypes = {
    stats: PropTypes.object,
  }
  render () {
    const {length, mean, stdev, percentiles} = this.props.stats

    let range = null
    let low = null
    let high = null
    let lowDelta = null
    let highDelta = null
    if (_.isObject(percentiles)) {
      [low, high] = [percentiles[5], percentiles[95]]
      range = mean - ((high + low) / 2)
      lowDelta = mean - low
      highDelta = high - mean
    }

    const precision = length === 1 ? 6 : 2

    const symmetric = false
    const ninetypercentCI = false
    const asymmetric = true

    return (
      <div className="DistributionSummary">
        <PrecisionNumber value={parseFloat(mean)} precision={precision}/>
          {symmetric &&
            !!range && range !== 0 &&
              <Uncertainty range={range} />
          }
          {ninetypercentCI &&
            !!low && !!high && high*low !== 0 &&
              <NinetyPercentCI low={low} high={high} />
          }
          {asymmetric &&
            !!lowDelta && !!highDelta && highDelta*lowDelta !== 0 &&
              <AsymmetricUncertainty lowDelta={lowDelta} highDelta={highDelta} />
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

