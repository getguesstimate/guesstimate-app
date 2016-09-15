import React, {Component} from 'react'
import {FactItem} from 'gComponents/facts/list/item.js'

import FlowGrid from 'gComponents/lib/FlowGrid/FlowGrid'

export class FactGraph extends Component {

  items() {
    const {facts, spaces} = this.props;
    const fakeNode = {
      location: {row: 0, column: 0}
    }

    return [
      ..._.map(facts, (fact, index) => {
        return {key: index, location: {row: index, column: 0}, component: <FactItem fact={fact}/>}
      })
    ]
  }

  render() {
    return (
      <div
        style={{backgroundColor: '#ddd', float: 'left'}}
      >
        <FlowGrid
          items={this.items()}
          onMultipleSelect={() => {}}
          hasItemUpdated = {() => false}
          isItemEmpty = {() => false}
          edges={[]}
          selectedRegion={[]}
          copiedRegion={[]}
          selectedCell={{}}
          analyzedRegion={[]}
          onUndo={() => {}}
          onRedo={() => {}}
          onSelectItem={() => {}}
          onDeSelectAll={() => {}}
          onAutoFillRegion={() => {}}
          onAddItem={() => {}}
          onMoveItem={() => {}}
          onRemoveItems={() => {}}
          onCopy={() => {}}
          onPaste={() => {}}
          onCut={() => {}}
          showGridLines={true}
          canvasState={{}}
        />
      </div>
    )
  }
}
