import React, {Component} from 'react'
import Icon from 'react-fa'

import numberShow from 'lib/numberShower/numberShower'

const PrecisionNumber = ({value, precision, number=numberShow(value, precision)}) => (
  <span className='result-value'>
    {number.value}{number.symbol}
    {number.power && (<span>{`\u00b710`}<sup>{number.power}</sup></span>)}
  </span>
)

const RangeDisplay = ({low, high}) => (
  <div><PrecisionNumber value={low}/> to <PrecisionNumber value={high}/></div>
)

const ResultSection = ({length, mean, percentiles}) => (
  length === 1 ? <PrecisionNumber value={mean} precision={6}/> : <RangeDisplay low={percentiles[5]} high={percentiles[95]}/>
)

const AnalyticsSection = (stats) => {
  return (
    <div className='stats-summary'>
      {`According to the model, this value has a 95% chance of being above `}
      <PrecisionNumber value={stats.percentiles[5]}/>
      {` and a 95% chance of being below `}
      <PrecisionNumber value={stats.percentiles[95]}/>
      {'.'}
      {` The mean value is `}
      <PrecisionNumber value={stats.mean}/>
      {` and the median is `}
      <PrecisionNumber value={stats.percentiles[50]}/>
      {`.`}
    </div>
  )
}

export class Output extends Component {
  state = {
    showAnalysis: false
  }

  showAnalysis(show=true) {
    this.setState({showAnalysis: show})
  }

  render() {
    const {metric: {name, simulation}} = this.props
    const {showAnalysis} = this.state
    return (
      <div className='output'>
        <div className='row'>
          <div className='col-xs-12 col-sm-7'>
            <div className='name'>
              {name}
            </div>
          </div>
          <div className='col-xs-12 col-sm-5'>
            <div className={`result-section${!_.isEmpty(_.get(simulation, 'sample.errors')) ? ' has-errors' : ''}`}>
              {_.has(simulation, 'stats') && <ResultSection {...simulation.stats} />}

              {!showAnalysis && _.has(simulation, 'stats.percentiles.5') &&
                <div className='icon' onClick={() => this.showAnalysis(true)}> ? </div>
              }
              {showAnalysis &&
                <div className='icon' onClick={() => this.showAnalysis(false)}> <i className={`ion-md-close`}/></div>
              }

              {showAnalysis && _.has(simulation, 'stats.percentiles.5') &&
                <AnalyticsSection {...simulation.stats} />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
