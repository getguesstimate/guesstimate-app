import React, {Component, PropTypes} from 'react';
import numeral from 'numeral'
import _ from 'lodash'

class DistributionSummarySmall extends Component{
  format(n){
    if (n) {
      let value = parseFloat(n);
      return numeral(value).format('0a');
    }
  }
  uncertainty() {
    console.log(this.props)
    let distribution = this.props.distribution;
    let hasStdev = distribution && distribution.stdev;
    return (
     <span className='stdev'>
     {hasStdev ? '±' : ''}
     {this.format(_.get(this, 'props.distribution.stdev'))}
     </span>
    )
  }
  render () {
    let stdev = this.props.distribution.stdev
    let hasUncertainty = !_.isUndefined(stdev) && (stdev !== 0)
    return (
      <div className="distribution-summary">
       {this.format(_.get(this, 'props.distribution.mean'))}
       {hasUncertainty ? this.uncertainty() : '' }
     </div>
    )
  }
}

export default class DistributionSummary extends Component{
  small() {
    return (<DistributionSummarySmall distribution={this.props.distribution}/> )
  }
  render () {
    let hasDistribution = !_.isEmpty(this.props.distribution)
    return (
      <div>
      {hasDistribution ? this.small() : '' }
      </div>
    )
  }
};

