import _ from "lodash";
import { SimulationDAG } from "../DAG";
import * as errorTypes from "../errors";

import * as _collections from "gEngine/collections";

const {
  ERROR_TYPES: { GRAPH_ERROR, SAMPLING_ERROR },
  ERROR_SUBTYPES: {
    GRAPH_ERROR_SUBTYPES: {
      MISSING_INPUT_ERROR,
      IN_INFINITE_LOOP,
      INVALID_ANCESTOR_ERROR,
    },
    SAMPLING_ERROR_SUBTYPES: { DIVIDE_BY_ZERO_ERROR },
  },
} = errorTypes;

describe("Simulation DAG", () => {
  const nodes = [
    { id: "A", expression: "3" },
    { id: "B", expression: "${A}" },
    { id: "C", expression: "${A}" },
    { id: "D", expression: "${B}" },
    { id: "E", expression: "${B}" },
    { id: "F", expression: "${A} + ${C}" },

    { id: "1", expression: "0" },
    { id: "2", expression: "${3} + ${0} + ${1}" },
    { id: "3", expression: "${2}" },
    { id: "4", expression: "${3}" },
    {
      id: "5",
      expression: "1/0",
      errors: [{ type: SAMPLING_ERROR, subType: DIVIDE_BY_ZERO_ERROR }],
    },
    { id: "6", expression: "${5}" },
    { id: "7", expression: "${6}" },
    { id: "8", expression: "${missing} + ${missing} + ${1} + ${gone}" },
  ];
  const DAG = new SimulationDAG(nodes);

  describe("error assignment", () => {
    describe("assigns errors properly", () => {
      const missingInputNode = _collections.get(DAG.nodes, "8");
      const infiniteLoopNodes = [
        _collections.get(DAG.nodes, "2"),
        _collections.get(DAG.nodes, "3"),
      ];
      const divZeroNode = _collections.get(DAG.nodes, "5");
      const childOfLoopNode = _collections.get(DAG.nodes, "4");
      const childOfDivZeroNode = _collections.get(DAG.nodes, "6");
      const grandchildOfDivZeroNode = _collections.get(DAG.nodes, "7");

      test("Missing input errors are annotated correctly", () => {
        expect(missingInputNode.errors).toEqual([
          {
            type: GRAPH_ERROR,
            subType: MISSING_INPUT_ERROR,
            missingInputs: ["missing", "gone"],
          },
        ]);
      });

      test("Infinite loop nodes receive the correct errors", () => {
        expect(_.map(infiniteLoopNodes, "errors")).toEqual([
          [
            {
              type: GRAPH_ERROR,
              subType: IN_INFINITE_LOOP,
              cycleIds: ["2", "3"],
            },
            {
              type: GRAPH_ERROR,
              subType: MISSING_INPUT_ERROR,
              missingInputs: ["0"],
            },
          ],
          [
            {
              type: GRAPH_ERROR,
              subType: IN_INFINITE_LOOP,
              cycleIds: ["2", "3"],
            },
            {
              type: GRAPH_ERROR,
              subType: INVALID_ANCESTOR_ERROR,
              ancestors: [],
              inputs: ["2"],
            },
          ],
        ]);
      });

      test("Incoming errors are preserved through construction", () => {
        expect(divZeroNode.errors).toEqual([
          { type: SAMPLING_ERROR, subType: DIVIDE_BY_ZERO_ERROR },
        ]);
      });

      test("Invalid ancestor errors for graph errors are annotated properly", () => {
        expect(childOfLoopNode.errors).toEqual([
          {
            type: GRAPH_ERROR,
            subType: INVALID_ANCESTOR_ERROR,
            ancestors: ["2"],
            inputs: ["3"],
          },
        ]);
      });
      test("Invalid ancestor errors for incoming errors are annotated properly", () => {
        expect(childOfDivZeroNode.errors).toEqual([
          {
            type: GRAPH_ERROR,
            subType: INVALID_ANCESTOR_ERROR,
            ancestors: [],
            inputs: ["5"],
          },
        ]);
      });
      test("Invalid ancestor errors for distant relatives are annotated properly", () => {
        expect(grandchildOfDivZeroNode.errors).toEqual([
          {
            type: GRAPH_ERROR,
            subType: INVALID_ANCESTOR_ERROR,
            ancestors: ["5"],
            inputs: [],
          },
        ]);
      });
    });
  });

  describe("#find", () => {
    it("finds the correct nodes", () => {
      // TODO(matthew): Matches simulation node.
      expect(DAG.find("A")!.id).toEqual("A");
      expect(DAG.find("F")!.id).toEqual("F");
    });
  });
  describe("#subset", () => {
    test("a subset from the root should include everything", () => {
      expect(DAG.subsetFrom(["A"]).map((n) => n.id)).toEqual([
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
      ]);
    });
    test("a subset from a list should include all relevant subsets", () => {
      expect(DAG.subsetFrom(["C", "E"]).map((n) => n.id)).toEqual([
        "C",
        "E",
        "F",
      ]);
    });

    test("a subset containing graph errors should be correct", () => {
      expect(
        DAG.subsetFrom(["1"])
          .map((n) => n.id)
          .sort()
      ).toEqual(["1", "2", "3", "4", "8"]);
    });
    test("a subset containing incoming errors should be correct", () => {
      expect(DAG.subsetFrom(["5"]).map((n) => n.id)).toEqual(["5", "6", "7"]);
    });
  });
  describe("#strictSubset", () => {
    it("forms the correct strict subsets", () => {
      expect(DAG.strictSubsetFrom(["A"]).map((n) => n.id)).toEqual([
        "B",
        "C",
        "D",
        "E",
        "F",
      ]);
      expect(DAG.strictSubsetFrom(["C", "E"]).map((n) => n.id)).toEqual(["F"]);
    });
  });
});
