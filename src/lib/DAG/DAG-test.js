import { expect } from "chai";

import {
  getCycleSets,
  toCyclePseudoNode,
  separateIntoHeightSets,
  separateIntoDisconnectedComponents,
} from "./DAG";
import { getNodeAncestors } from "./nodeFns";

describe("DAG library", () => {
  const withCycles = [
    { id: "A", inputs: ["G"] },
    { id: "B", inputs: ["A"] },
    { id: "C", inputs: ["B"] },
    { id: "D", inputs: ["C"] },
    { id: "E", inputs: ["D", "K"] },
    { id: "F", inputs: ["E"] },
    { id: "G", inputs: ["F"] },
    { id: "H", inputs: ["K"] },
    { id: "I", inputs: ["H"] },
    { id: "J", inputs: ["I"] },
    { id: "K", inputs: ["J"] },
    { id: "1", inputs: [] },
    { id: "2", inputs: ["1"] },
    { id: "3", inputs: ["1"] },
  ];
  describe("getCycleSets", () => {
    const nodeAncestors = getNodeAncestors(withCycles);
    const { acyclicNodes, cycleSets } = getCycleSets(withCycles, nodeAncestors);

    it("Correctly extracts cycles", () => {
      expect(acyclicNodes).to.deep.have.members([
        { id: "1", inputs: [] },
        { id: "2", inputs: ["1"] },
        { id: "3", inputs: ["1"] },
      ]);
      expect(cycleSets).to.deep.have.members([
        [
          { id: "A", inputs: ["G"] },
          { id: "B", inputs: ["A"] },
          { id: "C", inputs: ["B"] },
          { id: "D", inputs: ["C"] },
          { id: "E", inputs: ["D", "K"] },
          { id: "F", inputs: ["E"] },
          { id: "G", inputs: ["F"] },
        ],
        [
          { id: "H", inputs: ["K"] },
          { id: "I", inputs: ["H"] },
          { id: "J", inputs: ["I"] },
          { id: "K", inputs: ["J"] },
        ],
      ]);
    });

    const cyclePseudoNodes = cycleSets.map(toCyclePseudoNode);
    it("correctly makes psuedo nodes", () => {
      expect(cyclePseudoNodes).to.deep.have.members([
        {
          id: null,
          isCycle: true,
          inputs: ["K"],
          outputs: [],
          nodes: [
            { id: "A", inputs: ["G"] },
            { id: "B", inputs: ["A"] },
            { id: "C", inputs: ["B"] },
            { id: "D", inputs: ["C"] },
            { id: "E", inputs: ["D", "K"] },
            { id: "F", inputs: ["E"] },
            { id: "G", inputs: ["F"] },
          ],
        },
        {
          id: null,
          isCycle: true,
          inputs: [],
          outputs: [],
          nodes: [
            { id: "H", inputs: ["K"] },
            { id: "I", inputs: ["H"] },
            { id: "J", inputs: ["I"] },
            { id: "K", inputs: ["J"] },
          ],
        },
      ]);
    });
  });

  describe("separateIntoHeightSets", () => {
    const nodesToSeparate = [
      { id: "0", inputs: [] },
      { id: "1", inputs: [] },
      { id: "2", inputs: ["1"] },
      { id: "3", inputs: ["1"] },
      {
        id: null,
        isCycle: true,
        inputs: ["3"],
        nodes: [
          { id: "4", inputs: ["3", "5"] },
          { id: "5", inputs: ["4"] },
        ],
      },
      { id: "6", inputs: ["3"] },
      { id: "7", inputs: ["1", "6"] },
      { id: "8", inputs: ["5", "4", "missing"] },
    ];

    it("separates into proper height sets", () => {
      const heightSets = separateIntoHeightSets(nodesToSeparate);
      expect(heightSets).to.deep.equal([
        [
          { id: "0", inputs: [] },
          { id: "1", inputs: [] },
        ],
        [
          { id: "2", inputs: ["1"] },
          { id: "3", inputs: ["1"] },
        ],
        [
          {
            id: null,
            isCycle: true,
            inputs: ["3"],
            nodes: [
              { id: "4", inputs: ["3", "5"] },
              { id: "5", inputs: ["4"] },
            ],
          },
          { id: "6", inputs: ["3"] },
        ],
        [
          { id: "7", inputs: ["1", "6"] },
          { id: "8", inputs: ["5", "4", "missing"] },
        ],
      ]);
    });
  });

  describe("separateIntoDisconnectedComponents", () => {
    const nodes = [
      { id: "1", inputs: [] },
      { id: "2", inputs: ["1"] },
      { id: "3", inputs: ["1"] },
      { id: "4", inputs: [] },
      { id: "5", inputs: ["4"] },
      { id: "6", inputs: ["4", "5"] },
    ];

    const nodeAncestors = getNodeAncestors(nodes);
    const components = separateIntoDisconnectedComponents(nodes, nodeAncestors);
    expect(components).to.have.length(2);
    expect(components[0]).to.deep.have.members([
      { id: "1", inputs: [] },
      { id: "2", inputs: ["1"] },
      { id: "3", inputs: ["1"] },
    ]);
    expect(components[1]).to.deep.have.members([
      { id: "4", inputs: [] },
      { id: "5", inputs: ["4"] },
      { id: "6", inputs: ["4", "5"] },
    ]);
  });
});
