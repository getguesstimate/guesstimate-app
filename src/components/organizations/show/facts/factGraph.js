import React, {Component} from 'react'
import {FactItem} from 'gComponents/facts/list/item.js'

import FlowGrid from 'gComponents/lib/FlowGrid/FlowGrid'

import * as _collections from 'gEngine/collections'
import * as _space from 'gEngine/space'

import './style.css'

const SpaceCard = ({space}) => (
  <a className='spaceNode' href={_space.spaceUrlById(space.id)}>
    {space.name}
  </a>
)

export class FactGraph extends Component {
  itemsAndEdges() {
    const {facts, spaces} = this.props

    const factNodes = _.map(facts, fact => ({
      key: `fact:${fact.id}`,
      id: `fact:${fact.id}`,
      children: fact.imported_to_intermediate_space_ids.map(id => `space:${id}`),
      parents: !!fact.exported_from_id ? [`space:${fact.exported_from_id}`] : [],
      component: <FactItem fact={fact}/>,
    }))

    const intermediateSpaces = _.filter(spaces, s => s.exported_facts_count > 0 || !_.isEmpty(s.imported_fact_ids))
    const spaceNodes = _.map(intermediateSpaces, s => ({
      key: `space:${s.id}`,
      id: `space:${s.id}`,
      parents: s.imported_fact_ids.map(id => `fact:${id}`),
      component: <SpaceCard space={s} />,
    }))

    let unprocessedNodes = [...factNodes, ...spaceNodes]
    let heightOrderedNodes = []
    const allParentswithin = nodeSet => n => _.every(n.parents, p => _.some(nodeSet, ({id}) => p === id))
    while (!_.isEmpty(unprocessedNodes)) {
      const nextLevelNodes = _.remove(unprocessedNodes, allParentswithin(_.flatten(heightOrderedNodes)))
      if (_.isEmpty(nextLevelNodes)) { break }
      heightOrderedNodes.push(nextLevelNodes)
    }

    let items = []
    heightOrderedNodes.forEach((heightSet, height) => {
      const withLocations = _.map(heightSet, (node, index) => ({
        ...node,
        location: {row: index, column: height},
      }))
      items.push(...withLocations)
    })
    const locationById = id => _collections.gget(items, id, 'id', 'location')

    let edges = []
    const pathStatus = 'default'
    factNodes.forEach(({id, children, parents})  => {
      edges.push(...children.map(c => ({input: locationById(id), output: locationById(c), pathStatus})))
      edges.push(...parents.map(p => ({input: locationById(p), output: locationById(id), pathStatus})))
    })

    return { items, edges }
  }

  render() {
    const {items, edges} = this.itemsAndEdges()
    return (
      <div
        className='FactGraph'
      >
        <FlowGrid
          items={items}
          onMultipleSelect={() => {}}
          hasItemUpdated = {() => false}
          isItemEmpty = {() => false}
          edges={edges}
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
          showGridLines={false}
          canvasState={{}}
        />
      </div>
    )
  }
}
