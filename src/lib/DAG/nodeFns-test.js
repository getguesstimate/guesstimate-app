import { expect } from "chai";

import {
  getNodeAncestors,
  getMissingInputs,
  allInputsWithinFn,
  anyRelationsWithinFn,
  inACycleWithNodeFn,
  containsDuplicates,
  isDescendedFromFn,
  withInputIndicesFn,
} from "./nodeFns";

describe("nodeFns", () => {
  describe("getNodeAncestors", () => {
    const layeredGraphNodes = [
      { id: "A", inputs: [] },
      { id: "B", inputs: ["A"] },
      { id: "C", inputs: ["A"] },
      { id: "D", inputs: ["B"] },
      { id: "E", inputs: ["B"] },
      { id: "F", inputs: ["C"] },
      { id: "G", inputs: ["F", "D"] },
      { id: "H", inputs: ["I"] },
      { id: "I", inputs: ["H", "A"] },
      { id: "J", inputs: ["G", "I"] },
      { id: "K", inputs: [] },
      { id: "L", inputs: ["K"] },
      { id: "M", inputs: ["K"] },
      { id: "N", inputs: ["M", "L"] },
    ];
    it("Correctly assigns nodes their relations", () => {
      const nodeAncestors = getNodeAncestors(layeredGraphNodes);
      expect(nodeAncestors["I"]).to.have.members(["H", "I", "A"]);
      expect(nodeAncestors["I"].length).to.eq(3);

      expect(nodeAncestors["J"]).to.have.members([
        "G",
        "I",
        "H",
        "A",
        "F",
        "D",
        "C",
        "B",
      ]);
      expect(nodeAncestors["J"].length).to.eq(8);

      expect(nodeAncestors["A"]).to.have.members([]);

      expect(nodeAncestors["B"]).to.have.members(["A"]);
      expect(nodeAncestors["B"].length).to.eq(1);

      expect(nodeAncestors["N"]).to.have.members(["K", "L", "M"]);
      expect(nodeAncestors["N"].length).to.eq(3);
    });
  });

  describe("getMissingInputs", () => {
    const nodes = [
      { id: "1", inputs: [] },
      { id: "2", inputs: ["missing", "missing"] },
      { id: "3", inputs: ["1", "2"] },
      { id: "4", inputs: ["2", "3", "missing"] },
      { id: "5", inputs: ["3", "4", "gone", "not"] },
    ];

    it("extracts missing inputs", () => {
      const missingInputs = getMissingInputs(nodes);
      expect(missingInputs).to.have.members(["missing", "gone", "not"]);
    });
  });

  describe("allInputsWithinFn", () => {
    it("correctly returns when the input list of nodes is empty", () => {
      expect(allInputsWithinFn([])({ id: "a", inputs: [] })).to.be.true;
      expect(allInputsWithinFn([])({ id: "a", inputs: ["1"] })).to.be.false;
    });

    it("correctly identifies when all non-ignored inputs are within the list of nodes.", () => {
      const nodes = [
        { id: "1", inputs: [] },
        { id: "2", inputs: ["1"] },
        { id: "4", inputs: ["2"] },
      ];
      const ignoreSet = ["missing", "foo"];
      const testFn = allInputsWithinFn(nodes, ignoreSet);

      expect(testFn({ id: "A", inputs: ["1", "4", "missing"] })).to.be.true;
      expect(testFn({ id: "B", inputs: ["2", "3", "foo"] })).to.be.false;
    });
  });

  describe("anyRelationsWithinFn", () => {
    it("correctory returns when the input list of nodes is empty", () => {
      const testFn = anyRelationsWithinFn([], {
        a: ["b", "c"],
        b: [],
        c: ["b"],
      });
      expect(testFn({ id: "b", inputs: [] })).to.be.false;
      expect(testFn({ id: "a", inputs: ["c"] })).to.be.false;
    });

    describe("correctly catches relationships", () => {
      const nodes = [
        { id: "1", inputs: ["0"] },
        { id: "C", inputs: ["B"] },
      ];
      const ancestors = {
        0: [],
        1: ["0"],
        2: ["0"],
        3: ["0", "1"],
        4: ["0", "2", "1", "3"],
        A: [],
        B: ["A"],
        C: ["B", "A"],
      };

      const testFn = anyRelationsWithinFn(nodes, ancestors);
      it("correctly excludes non-relatives", () => {
        expect(testFn({ id: "2", inputs: ["0"] })).to.be.false;
      });
      it("correctly excludes nodes within the id set", () => {
        expect(testFn({ id: "1", inputs: ["0"] })).to.be.false;
        expect(testFn({ id: "C", inputs: ["A"] })).to.be.false;
      });
      it("correctly flags descendants", () => {
        expect(testFn({ id: "4", inputs: ["3", "2"] })).to.be.true;
      });
      it("correctly flags ancestors", () => {
        expect(testFn({ id: "A", inputs: [] })).to.be.true;
      });
    });
  });

  describe("inACycleWithNodeFn", () => {
    it("correctly catches cycles", () => {
      const node = { id: "1", inputs: ["0"] };
      const ancestors = {
        0: ["2", "0", "1"],
        1: ["0", "1", "2"],
        2: ["1", "2", "0"],
        3: ["1", "0", "2"],
        4: ["0", "2", "1", "3"],
      };

      const testFn = inACycleWithNodeFn(node, ancestors);
      expect(testFn({ id: "0", inputs: ["2"] })).to.be.true;
      expect(testFn({ id: "1", inputs: ["0"] })).to.be.true;
      expect(testFn({ id: "2", inputs: ["1"] })).to.be.true;
      expect(testFn({ id: "3", inputs: ["2"] })).to.be.false;
      expect(testFn({ id: "4", inputs: ["3"] })).to.be.false;
    });
  });

  describe("isDescendedFromFn", () => {
    it("correctory returns when the input list of ids is empty", () => {
      const testFn = isDescendedFromFn([], { a: ["b", "c"], b: [], c: ["b"] });
      expect(testFn({ id: "b", inputs: [] })).to.be.false;
      expect(testFn({ id: "a", inputs: ["c"] })).to.be.false;
    });

    describe("correctly catches descendants", () => {
      const ancestors = {
        0: [],
        1: ["0"],
        2: ["0"],
        3: ["0", "1"],
        4: ["0", "2", "1", "3"],
        A: [],
        B: ["A"],
        C: ["B", "A"],
      };

      const testFn = isDescendedFromFn(["1", "B"], ancestors);
      it("correctly excludes non-relatives and ancestors", () => {
        expect(testFn({ id: "2", inputs: ["0"] })).to.be.false;
        expect(testFn({ id: "0", inputs: [] })).to.be.false;
        expect(testFn({ id: "A", inputs: [] })).to.be.false;
      });

      it("correctly excludes nodes within the id set", () => {
        expect(testFn({ id: "1", inputs: ["0"] })).to.be.false;
        expect(testFn({ id: "B", inputs: ["A"] })).to.be.false;
      });

      it("correctly flags descendants", () => {
        expect(testFn({ id: "4", inputs: ["3", "2"] })).to.be.true;
        expect(testFn({ id: "C", inputs: ["B"] })).to.be.true;
      });
    });
  });

  describe("containsDuplicates", () => {
    it("correctly returns false with an empty list", () => {
      expect(containsDuplicates([])).to.be.false;
    });
    it("correctly returns false with a list with no dupes", () => {
      expect(
        containsDuplicates([
          { id: "0", inputs: [] },
          { id: "1", inputs: ["0"] },
          { id: "2", inputs: ["0"] },
        ])
      ).to.be.false;
    });
    it("correctly returns true with a list with dupes", () => {
      expect(
        containsDuplicates([
          { id: "0", inputs: [] },
          { id: "1", inputs: ["0"] },
          { id: "0", inputs: ["1"] },
        ])
      ).to.be.true;
    });
  });

  describe("withInputIndicesFn", () => {
    it("correctly extracts input indices", () => {
      const nodes = [
        { id: "0", inputs: [] },
        { id: "1", inputs: ["0"] },
        { id: "2", inputs: [] },
        { id: "3", inputs: ["0", "2", "missing"] },
      ];
      expect(
        withInputIndicesFn(nodes)({ id: "3", inputs: ["0", "2", "missing"] })
      ).to.deep.equal({
        id: "3",
        inputs: ["0", "2", "missing"],
        inputIndices: [0, 2],
      });
    });
  });
});
