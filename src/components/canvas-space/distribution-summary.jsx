import React, {Component, PropTypes} from 'react';
import numeral from 'numeral'
import _ from 'lodash'
import stats from 'stats-lite'

function formatStat(n){
  if (n) {
    let value = parseFloat(n);
    return numeral(value).format('0a');
  }
}

const Uncertainty = ({stdev}) => (
  <span className='stdev'> '±' {formatStat(stdev)} </span>
)

class DistributionSummarySmall extends Component{
  render () {
    let stats = this.props.stats;
    return (
      <div className="distribution-summary">
       {formatStat(stats.mean)}
       {_.has(stats, 'stdev') ? <Uncertainty stdev={this.props.stdev}/> : null }
     </div>
    )
  }
}

export default class DistributionSummary extends Component{
  show() {
    return (<DistributionSummarySmall stats={this.stats()}/> )
  }
  stats(){
    return _.get(this.props.simulation, 'stats') || false
  }
  render () {
    return (
      <div>
      {this.stats() ? this.show() : '' }
      </div>
    )
  }
};

