import React, {Component} from 'react'
import {FactItem} from 'gComponents/facts/list/item.js'

import FlowGrid from 'gComponents/lib/FlowGrid/FlowGrid'

import * as _collections from 'gEngine/collections'
import * as _utils from 'gEngine/utils'
import * as _space from 'gEngine/space'

import './style.css'

const SpaceCard = ({space}) => (
  <a className='spaceNode' href={_space.spaceUrlById(space.id)}>
    {space.name}
  </a>
)

export class FactGraph extends Component {
  itemsAndEdges() {
    console.log('foowsh start')
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
      children: _collections.filter(facts, s.id, 'exported_from_id').map(f => `fact:${f.id}`),
      component: <SpaceCard space={s} />,
    }))

    let unprocessedNodes = [...factNodes, ...spaceNodes]
    let heightOrderedNodes = []
    const allParentswithin = nodeSet => n => _.every(n.parents, p => _.some(nodeSet, ({id}) => p === id))
    let times = 0
    while (!_.isEmpty(unprocessedNodes)) {
      console.log('looped', times++, 'times')
      const nextLevelNodes = _.remove(unprocessedNodes, allParentswithin(_.flatten(heightOrderedNodes)))
      if (_.isEmpty(nextLevelNodes)) { break }
      heightOrderedNodes.push(nextLevelNodes)
    }

    let sortedHeightOrderedNodes = []
    heightOrderedNodes.forEach(heightSet => {
      const prevLayer = _utils.orArr(_.last(sortedHeightOrderedNodes))
      let newLayer = _utils.mutableCopy(heightSet)
      let newLayerOrdered = []
      prevLayer.filter(n => !_.isEmpty(n.children.length)).forEach(n => {
        const children = _.remove(newLayer, ({id}) => n.children.includes(id))
        const childrenSorted = _.sortBy(children, c => -c.children.length)
        newLayerOrdered.push(...childrenSorted)
      })
      const restSorted = _.sortBy(newLayer, n => -n.children.length)
      newLayerOrdered.push(...restSorted)

      sortedHeightOrderedNodes.push(newLayerOrdered)
    })

    let items = []
    sortedHeightOrderedNodes.forEach((heightSet, height) => {
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
    let {items, edges} = this.itemsAndEdges()
    items = items.slice(0,3)
    edges = edges.slice(0,3)

    console.log('items', items, 'edges', edges)
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
