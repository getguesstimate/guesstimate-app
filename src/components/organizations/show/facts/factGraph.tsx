import _ from "lodash";
import React, { Component } from "react";

import { FactItem } from "gComponents/facts/list/item";
import FlowGrid from "gComponents/lib/FlowGrid/FlowGrid";
import { SpaceCard } from "gComponents/spaces/cards";

import * as _collections from "gEngine/collections";
import * as _utils from "gEngine/utils";

import {
  separateIntoDisconnectedComponents,
  separateIntoHeightSets,
} from "lib/DAG/DAG";
import { getNodeAncestors } from "lib/DAG/nodeFns";
import { Fact } from "gEngine/facts";
import { GridItem } from "gComponents/lib/FlowGrid/types";
import { ApiSpace } from "lib/guesstimate_api/resources/Models";

const idToNodeId = (id: string | number, isFact: boolean) =>
  `${isFact ? "fact" : "space"}:${id}`;
const spaceIdToNodeId = ({ id }) => idToNodeId(id, false);
const factIdToNodeId = ({ id }) => idToNodeId(id, true);

type FactGridItem = Omit<GridItem, "location"> & {
  id: string;
  inputs: any[];
  outputs: any[];
};

const makeFactNodeFn =
  (spaces) =>
  (fact: Fact): FactGridItem => ({
    key: factIdToNodeId(fact),
    id: factIdToNodeId(fact),
    outputs: spaces
      .filter((s) => _utils.orArr(s.imported_fact_ids).includes(fact.id))
      .map(spaceIdToNodeId),
    inputs: !!fact.exported_from_id
      ? [idToNodeId(fact.exported_from_id, false)]
      : [],
    props: {},
    component: () => <FactItem fact={fact} size="SMALL" />,
  });

const makeSpaceNodeFn =
  (facts: Fact[]) =>
  (s): FactGridItem => ({
    key: spaceIdToNodeId(s),
    id: spaceIdToNodeId(s),
    inputs: s.imported_fact_ids.map((id) => idToNodeId(id, true)),
    outputs: _collections
      .filter(facts, s.id, "exported_from_id")
      .map(factIdToNodeId),
    props: {},
    component: () => (
      <SpaceCard
        size="SMALL"
        key={s.id}
        space={s}
        urlParams={{ factsShown: "true" }}
      />
    ),
  });

const addLocationsToHeightOrderedComponents = (componentsHeightOrdered) => {
  let withFinalLocations: any[] = [];
  let maxRowUsed = 0;
  componentsHeightOrdered.forEach((heightOrderedComponent) => {
    let sortedHeightOrderedNodes: any[] = [];
    let currColumn = 0;
    let maxRowUsedInComponent = maxRowUsed;
    heightOrderedComponent.forEach((heightSet) => {
      const prevLayer = _utils.orArr(_.last(sortedHeightOrderedNodes));
      let newLayer = _utils.mutableCopy(heightSet);
      let newLayerOrdered: any[] = [];
      prevLayer
        .filter((n) => !_.isEmpty(n.outputs))
        .forEach((n) => {
          const outputs: any[] = _.remove(newLayer, ({ id }) =>
            n.outputs.includes(id)
          );
          const outputsSorted = _.sortBy(outputs, (c) => -c.outputs.length);
          newLayerOrdered.push(...outputsSorted);
        });
      const restSorted = _.sortBy(newLayer, (n) => -n.outputs.length);
      newLayerOrdered.push(...restSorted);

      let currRow = maxRowUsed;
      const withLocations = _.map(newLayerOrdered, (node) => {
        const withLocation = {
          ...node,
          location: { row: currRow, column: currColumn },
        };
        if (node.outputs.length > 3) {
          currRow += 2;
        } else {
          currRow += 1;
        }
        return withLocation;
      });
      maxRowUsedInComponent = Math.max(currRow, maxRowUsedInComponent);

      if (newLayerOrdered.length > 3) {
        currColumn += 2;
      } else {
        currColumn += 1;
      }

      sortedHeightOrderedNodes.push(withLocations);
    });
    maxRowUsed = maxRowUsedInComponent + 1;
    withFinalLocations.push(..._.flatten(sortedHeightOrderedNodes));
  });
  return { withFinalLocations, maxRowUsed };
};

type Props = {
  organization: any;
  facts: Fact[];
  spaces: ApiSpace[];
};

export class FactGraph extends Component<Props> {
  itemsAndEdges() {
    const { facts, spaces } = this.props;

    let factNodes = _.map(facts, makeFactNodeFn(spaces));

    const spacesToDisplay = _.filter(
      spaces,
      (s) => s.exported_facts_count > 0 || !_.isEmpty(s.imported_fact_ids)
    );
    const spaceNodes = _.map(spacesToDisplay, makeSpaceNodeFn(facts));

    // Here we remove some facts from the set of fact nodes, to display them separately, outside the rest of the graph.
    // In particular, we remove facts that are isolated (i.e. have no inputs or outputs) and orphaned facts, which are
    // facts that are missing inputs, due to missing deletions or other abnormal data setups. We don't want to
    // render those facts within the main graph, as they have no sensible edges we could display, so we pull them out to
    // render with the isolated nodes at the bottom of the graph.
    const isolatedFactNodes = _.remove(
      factNodes,
      (n) => _.isEmpty(n.outputs) && _.isEmpty(n.inputs)
    );

    const nodes = [...factNodes, ...spaceNodes];
    const nodeAncestors = getNodeAncestors(nodes);

    const components = separateIntoDisconnectedComponents(nodes, nodeAncestors);
    const componentsHeightOrdered = _.map(components, separateIntoHeightSets);

    const { withFinalLocations, maxRowUsed } =
      addLocationsToHeightOrderedComponents(componentsHeightOrdered);

    // Now we add locations to the isolated facts.
    const width = Math.floor(Math.sqrt(isolatedFactNodes.length));
    const isolatedFactNodesWithLocations = _.map(isolatedFactNodes, (n, i) => ({
      ...n,
      location: {
        row: maxRowUsed + 1 + Math.floor(i / width),
        column: i % width,
      },
    }));

    const items = [...isolatedFactNodesWithLocations, ...withFinalLocations];

    const locationById = (id) => _collections.gget(items, id, "id", "location");

    let edges: any[] = [];
    const pathStatus = "default";
    factNodes.forEach(({ id, outputs, inputs }) => {
      edges.push(
        ...outputs.map((c) => ({
          input: locationById(id),
          inputId: id,
          output: locationById(c),
          outputId: c,
          pathStatus,
        }))
      );
      edges.push(
        ...inputs.map((p) => ({
          input: locationById(p),
          inputId: p,
          output: locationById(id),
          outputId: id,
          pathStatus,
        }))
      );
    });

    const bad_edges = _.remove(
      edges,
      (edge) =>
        !_utils.allPropsPresent(
          edge,
          "input.row",
          "input.column",
          "output.row",
          "output.column"
        )
    );
    if (!_.isEmpty(bad_edges)) {
      console.warn(bad_edges.length, "BAD EDGES ENCOUNTERED!");
      console.warn(bad_edges);
    }

    return { items, edges };
  }

  render() {
    let { items, edges } = this.itemsAndEdges();

    return (
      <div className="FactGraph">
        <FlowGrid
          items={items}
          onMultipleSelect={() => {}}
          hasItemUpdated={() => false}
          isItemEmpty={() => false}
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
          isModelingCanvas={false}
        />
      </div>
    );
  }
}
