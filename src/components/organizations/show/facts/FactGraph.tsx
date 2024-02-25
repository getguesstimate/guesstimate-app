import React, { FC, PropsWithChildren } from "react";

import _ from "lodash";
import { SmallFactItem } from "~/components/facts/list/FactItem";
import { EdgeShape, PathStatus } from "~/components/lib/FlowGrid/Edges";
import { FlowGrid } from "~/components/lib/FlowGrid/FlowGrid";
import { GridItem } from "~/components/lib/FlowGrid/types";
import { SpaceCard } from "~/components/spaces/SpaceCards";
import {
  CyclePseudoNode,
  separateIntoDisconnectedComponents,
  separateIntoHeightSets,
} from "~/lib/DAG/DAG";
import { getNodeAncestors } from "~/lib/DAG/nodeFns";
import * as _collections from "~/lib/engine/collections";
import { Fact } from "~/lib/engine/facts";
import * as _utils from "~/lib/engine/utils";
import { ApiSpace } from "~/lib/guesstimate_api/resources/Models";
import { SimulationNodeParamsWithInputs } from "~/lib/propagation/DAG";
import { initialCanvasState } from "~/modules/canvas_state/slice";

const idToNodeId = (id: string | number, isFact: boolean) =>
  `${isFact ? "fact" : "space"}:${id}`;
const spaceIdToNodeId = ({ id }: { id: number }) => idToNodeId(id, false);
const factIdToNodeId = ({ id }: { id: number }) => idToNodeId(id, true);

type FactGridItem = Omit<GridItem, "location"> & {
  id: string;
  inputs: string[];
  outputs: string[];
};

const Box: FC<PropsWithChildren> = ({ children }) => (
  <div className="m-2 grid">{children}</div>
);

const makeFactNodeFn =
  (spaces: ApiSpace[]) =>
  (fact: Fact): FactGridItem => ({
    key: factIdToNodeId(fact),
    id: factIdToNodeId(fact),
    outputs: spaces
      .filter((s) => _utils.orArr(s.imported_fact_ids).includes(fact.id))
      .map(spaceIdToNodeId),
    inputs: !!fact.exported_from_id
      ? [idToNodeId(fact.exported_from_id, false)]
      : [],
    render: () => (
      <Box>
        <SmallFactItem fact={fact} />
      </Box>
    ),
  });

const makeSpaceNodeFn =
  (facts: Fact[]) =>
  (s: ApiSpace): FactGridItem => ({
    key: spaceIdToNodeId(s),
    id: spaceIdToNodeId(s),
    inputs: s.imported_fact_ids.map((id) => idToNodeId(id, true)),
    outputs: _collections
      .filter(facts, s.id, "exported_from_id")
      .map(factIdToNodeId),
    render: () => (
      <Box>
        <SpaceCard
          size="SMALL"
          key={s.id}
          space={s}
          urlParams={{ factsShown: "true" }}
        />
      </Box>
    ),
  });

const addLocationsToHeightOrderedComponents = (
  componentsHeightOrdered: (
    | SimulationNodeParamsWithInputs
    | CyclePseudoNode
  )[][][]
) => {
  const withFinalLocations: GridItem[] = [];
  let maxRowUsed = 0;
  componentsHeightOrdered.forEach((heightOrderedComponent) => {
    const sortedHeightOrderedNodes: any[][] = [];
    let currColumn = 0;
    let maxRowUsedInComponent = maxRowUsed;
    heightOrderedComponent.forEach((heightSet) => {
      const prevLayer = _utils.orArr(_.last(sortedHeightOrderedNodes));
      let newLayer = _utils.mutableCopy(heightSet);
      let newLayerOrdered: typeof newLayer = [];
      prevLayer
        .filter((n) => !_.isEmpty(n.outputs))
        .forEach((n) => {
          const outputs = _.remove(newLayer, ({ id }) =>
            n.outputs.includes(id)
          );
          const outputsSorted = _.sortBy(
            outputs,
            (c) => -(c.outputs?.length ?? 0)
          );
          newLayerOrdered.push(...outputsSorted);
        });
      const restSorted = _.sortBy(newLayer, (n) => -(n.outputs?.length ?? 0));
      newLayerOrdered.push(...restSorted);

      let currRow = maxRowUsed;
      const withLocations = newLayerOrdered.map((node) => {
        const withLocation = {
          ...node,
          location: { row: currRow, column: currColumn },
        };
        if ((node.outputs?.length ?? 0) > 3) {
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

const itemsAndEdges = (facts: Fact[], spaces: ApiSpace[]) => {
  const factNodes = facts.map(makeFactNodeFn(spaces));

  const spacesToDisplay = spaces.filter(
    (s) => s.exported_facts_count > 0 || !_.isEmpty(s.imported_fact_ids)
  );
  const spaceNodes = spacesToDisplay.map(makeSpaceNodeFn(facts));

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
  const componentsHeightOrdered = components.map(separateIntoHeightSets);

  const { withFinalLocations, maxRowUsed } =
    addLocationsToHeightOrderedComponents(componentsHeightOrdered);

  // Now we add locations to the isolated facts.
  const width = Math.floor(Math.sqrt(isolatedFactNodes.length));
  const isolatedFactNodesWithLocations = isolatedFactNodes.map((n, i) => ({
    ...n,
    location: {
      row: maxRowUsed + 1 + Math.floor(i / width),
      column: i % width,
    },
  }));

  const items: GridItem[] = [
    ...isolatedFactNodesWithLocations,
    ...withFinalLocations,
  ];

  const locationById = (id: string) =>
    _collections.gget(items, id, "id", "location");

  const edges: EdgeShape[] = [];
  const pathStatus: PathStatus = "default";
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

  const badEdges = _.remove(
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
  if (!_.isEmpty(badEdges)) {
    console.warn(badEdges.length, "BAD EDGES ENCOUNTERED!");
    console.warn(badEdges);
  }

  return { items, edges };
};

type Props = {
  facts: Fact[];
  spaces: ApiSpace[];
};

export const FactGraph: React.FC<Props> = (props) => {
  const { items, edges } = itemsAndEdges(props.facts, props.spaces);

  return (
    <div className="flex justify-center">
      <FlowGrid
        items={items}
        onMultipleSelect={() => {}}
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
        showGridLines={false}
        canvasState={initialCanvasState}
        isModelingCanvas={false}
        size="small"
      />
    </div>
  );
};
