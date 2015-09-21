import React, {Component, PropTypes} from 'react';
import numeral from 'numeral'

export default class DistributionSummary extends Component{
  format(n){
    if (n) {
      let value = parseFloat(n);
      return numeral(value).format('0a');
    }
  }
  render () {
    return (
      <div className="distribution-summary">
     {this.format(_.get(this, 'props.distribution.mean'))}
     <span className='stdev'>
       ±
       {this.format(_.get(this, 'props.distribution.stdev'))}
       </span>
       </div>
    )
  }
};

