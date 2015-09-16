import React from 'react'
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Icon from'react-fa'

const Funct = React.createClass({
  render() {
    let inputNames = this.props.funct._findInputMetrics().map(n => n.name);
    let outputName = this.props.funct.guesstimate.metric.name;
    let symbol = this.props.funct._functionType().sign
    let outputString = inputNames.join(' ' + symbol + ' ') + ' = ' + outputName;

    return (
    <div className="funct">
      <Tabs defaultActiveKey={1} bsStyle='pills'>
        <Tab eventKey={1} title=<Icon name='plus'/>>
          <h3> Addition </h3>
          <p> Add Points </p>
          <strong> {outputString} </strong>
        </Tab>
        <Tab eventKey={2} title=<Icon name='close'/>>
          <h3> Multiplication</h3>
          <p> Multiply Points</p>
          <strong> {outputString} </strong>
        </Tab>
      </Tabs>
    </div>
    )
  }
})
module.exports = Funct;
