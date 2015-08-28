import React from 'react'
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Icon from'react-fa'

const Funct = React.createClass({
  render() {
    return (
    <div className="funct">
      <Tabs defaultActiveKey={1}>
        <Tab eventKey={1} title=<Icon name='plus'/>>Add Things</Tab>
        <Tab eventKey={2} title=<Icon name='close'/>>Multiply Things</Tab>
      </Tabs>
    </div>
    )
  }
})
module.exports = Funct;
