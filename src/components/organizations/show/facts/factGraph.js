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

const allParentsWithin = nodeSet => n => _.every(n.parents, p => _.some(nodeSet, ({id}) => p === id))
const anyParentsWithin = nodeSet => n => _.some(n.parents, p => _.some(nodeSet, ({id}) => p === id))
const anyChildrenWithin = nodeSet => n => _.some(n.children, c => _.some(nodeSet, ({id}) => c === id))
const anyRelativesWithin = nodeSet => n => anyParentsWithin(nodeSet)(n) || anyChildrenWithin(nodeSet)(n)

function separateIntoHeightsAndStripInfiniteLoops(nodes) {
  let unprocessedNodes = _utils.mutableCopy(nodes)
  let heightOrderedNodes = []
  while (!_.isEmpty(unprocessedNodes)) {
    const nextLevelNodes = _.remove(unprocessedNodes, allParentsWithin(_.flatten(heightOrderedNodes)))
    if (_.isEmpty(nextLevelNodes)) { break }
    heightOrderedNodes.push(nextLevelNodes)
  }
  return heightOrderedNodes
}

function separateIntoDisconnectedComponents(nodes) {
  if (_.isEmpty(nodes)) { return [] }
  let unprocessedNodes = _utils.mutableCopy(nodes)
  let components = []
  let currentComponent = _.pullAt(unprocessedNodes, [0])
  while (!_.isEmpty(unprocessedNodes)) {
    const newComponentNodes = _.remove(unprocessedNodes, anyRelativesWithin(currentComponent))
    if (_.isEmpty(newComponentNodes)) {
      components.push(currentComponent)
      currentComponent = _.pullAt(unprocessedNodes, [0])
    } else {
      currentComponent.push(...newComponentNodes)
    }
  }
  components.push(currentComponent)
  return components
}

export class FactGraph extends Component {
  itemsAndEdges() {
    const {facts, spaces} = this.props

    let factNodes = _.map(facts, fact => ({
      key: `fact:${fact.id}`,
      id: `fact:${fact.id}`,
      children: spaces.filter(s => _utils.orArr(s.imported_fact_ids).includes(fact.id)).map(({id}) => `space:${id}`),
      parents: !!fact.exported_from_id ? [`space:${fact.exported_from_id}`] : [],
      component: <FactItem fact={fact} showModelLink={false}/>,
    }))

    const isolatedFactNodes = _.remove(factNodes, n => _.isEmpty(n.children) && _.isEmpty(n.parents))

    const spacesToDisplay = _.filter(spaces, s => s.exported_facts_count > 0 || !_.isEmpty(s.imported_fact_ids))
    const spaceNodes = _.map(spacesToDisplay, s => ({
      key: `space:${s.id}`,
      id: `space:${s.id}`,
      parents: s.imported_fact_ids.map(id => `fact:${id}`),
      children: _collections.filter(facts, s.id, 'exported_from_id').map(f => `fact:${f.id}`),
      component: <SpaceCard space={s} />,
    }))

    // Some facts may be missing parents, due to missing deletions or other abnormal data setups. We don't want to
    // render those facts within the main graph so we pull them out to render with the isolated nodes at the bottom of
    // the graph.
    const orphanedFactNodes = _.remove(factNodes, _.negate(allParentsWithin(spaceNodes)))

    let unprocessedNodes = [...factNodes, ...spaceNodes]
    const components = separateIntoDisconnectedComponents(unprocessedNodes)
    const componentsHeightOrdered = _.map(components, separateIntoHeightsAndStripInfiniteLoops)

    let withFinalLocations = []

    let maxRowUsed = 0
    componentsHeightOrdered.forEach(heightOrderedComponent => {
      let sortedHeightOrderedNodes = []
      let currColumn = 0
      let maxRowUsedInComponent = maxRowUsed
      heightOrderedComponent.forEach(heightSet => {
        const prevLayer = _utils.orArr(_.last(sortedHeightOrderedNodes))
        let newLayer = _utils.mutableCopy(heightSet)
        let newLayerOrdered = []
        prevLayer.filter(n => !_.isEmpty(n.children)).forEach(n => {
          const children = _.remove(newLayer, ({id}) => n.children.includes(id))
          const childrenSorted = _.sortBy(children, c => -c.children.length)
          newLayerOrdered.push(...childrenSorted)
        })
        const restSorted = _.sortBy(newLayer, n => -n.children.length)
        newLayerOrdered.push(...restSorted)

        let currRow = maxRowUsed
        const withLocations = _.map(newLayerOrdered, node => {
          const withLocation = {
            ...node,
            location: {row: currRow, column: currColumn},
          }
          if (node.children.length > 3) {
            currRow += 2
          } else {
            currRow += 1
          }
          return withLocation
        })
        maxRowUsedInComponent = Math.max(currRow, maxRowUsedInComponent)

        if (newLayerOrdered.length > 3) {
          currColumn += 2
        } else {
          currColumn += 1
        }

        sortedHeightOrderedNodes.push(withLocations)
      })
      maxRowUsed = maxRowUsedInComponent + 1
      withFinalLocations.push(..._.flatten(sortedHeightOrderedNodes))
    })

    // Now we add locations to the isolated facts.
    const width = Math.floor(Math.sqrt(isolatedFactNodes.length + orphanedFactNodes.length))
    const isolatedFactNodesWithLocations = _.map([...isolatedFactNodes, ...orphanedFactNodes], (n, i) => ({
      ...n,
      location: {row: maxRowUsed + 1 +  Math.floor(i/width), column: i % width},
    }))

    const items = [...isolatedFactNodesWithLocations, ...withFinalLocations]

    const locationById = id => _collections.gget(items, id, 'id', 'location')

    let edges = []
    const pathStatus = 'default'
    factNodes.forEach(({id, children, parents})  => {
      edges.push(...children.map(c => ({input: locationById(id), output: locationById(c), pathStatus})))
      edges.push(...parents.map(p => ({input: locationById(p), output: locationById(id), pathStatus})))
    })

    const bad_edges = _.remove(edges, ({input, output}) => !_utils.allPresent(input.row, input.column, output.row, output.column))
    if (!_.isEmpty(bad_edges)) {
      console.warn(bad_edges.length, 'BAD EDGES ENCOUNTERED!')
      console.warn(bad_edges)
    }

    return { items, edges }
  }

  render() {
    let {items, edges} = this.itemsAndEdges()

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
