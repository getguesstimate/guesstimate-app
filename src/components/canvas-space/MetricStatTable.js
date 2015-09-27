import React, {Component, PropTypes, addons} from 'react'
import ShowIf from '../utility/showIf';

@ShowIf
export default class MetricStatTable extends Component {
  static propTypes = {
    stats: React.PropTypes.object.isRequired,
  }
  render() {
    let stats = this.props.stats
    return (
      <div>
        <table className='important-stats'>
          <tr>
            <td> mean </td>
            <td> {stats.mean.toFixed(2)} </td>
          </tr>
          <tr>
            <td> std </td>
            <td> {stats.stdev.toFixed(2)} </td>
          </tr>
          <tr>
            <td> Samples </td>
            <td> {stats.length} </td>
          </tr>
        </table>
      </div>
    )
  }
}
