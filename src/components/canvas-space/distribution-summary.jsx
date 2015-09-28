import React, {Component, PropTypes} from 'react';
import numeral from 'numeral'
import _ from 'lodash'
import ShowIf from '../utility/showIf';

function formatStat(n){
  if (n) {
    let value = parseFloat(n);
    return numeral(value).format('0a');
  }
}

const Uncertainty = ShowIf(({stdev}) => (
  <span className='stdev'> {'±'} {formatStat(stdev)} </span>
))

@ShowIf
class DistributionSummarySmall extends Component{
  static propTypes = {
    stats: PropTypes.object,
  }
  render () {
    let stats = this.props.stats;
    return (
      <div className="distribution-summary">
        {formatStat(stats.mean)}
        <Uncertainty
            showIf={_.has(stats, 'stdev')}
            stdev={this.props.stats.stdev}
        />
      </div>
    )
  }
}

export default class DistributionSummary extends Component{
  static propTypes = {
    simulation: PropTypes.object,
  }
  stats(){
    return _.get(this.props.simulation, 'stats') || false
  }
  render () {
    return (
      <DistributionSummarySmall
          showIf={this.stats()}
          stats={this.stats()}
      />
    )
  }
};

