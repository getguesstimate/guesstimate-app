import React, {Component} from 'react'

import FlowGrid from 'gComponents/lib/FlowGrid/FlowGrid'

export class FactGraph extends Component {

  items() {
    const fakeNode = {
      location: {row: 0, column: 0}
    }
    //items={_.map(metrics, m => ({key: m.id, location: m.location, component: this.renderMetric(m, analyzedMetric)}))}
    return [
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
