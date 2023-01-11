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
      expect(nodeAncestors["I"].sort()).toEqual(["A", "H", "I"]);
      expect(nodeAncestors["I"].length).toEqual(3);

      expect(nodeAncestors["J"]).toEqual([
        "G",
        "I",
        "F",
        "D",
        "H",
        "A",
        "C",
        "B",
      ]);
      expect(nodeAncestors["J"].length).toEqual(8);

      expect(nodeAncestors["A"]).toEqual([]);

      expect(nodeAncestors["B"]).toEqual(["A"]);
      expect(nodeAncestors["B"].length).toEqual(1);

      expect(nodeAncestors["N"]).toEqual(["M", "L", "K"]);
      expect(nodeAncestors["N"].length).toEqual(3);
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
      expect(missingInputs).toEqual(["missing", "gone", "not"]);
    });
  });

  describe("allInputsWithinFn", () => {
    it("correctly returns when the input list of nodes is empty", () => {
      expect(allInputsWithinFn([])({ id: "a", inputs: [] })).toBe(true);
      expect(allInputsWithinFn([])({ id: "a", inputs: ["1"] })).toBe(false);
    });

    it("correctly identifies when all non-ignored inputs are within the list of nodes.", () => {
      const nodes = [
        { id: "1", inputs: [] },
        { id: "2", inputs: ["1"] },
        { id: "4", inputs: ["2"] },
      ];
      const ignoreSet = ["missing", "foo"];
      const testFn = allInputsWithinFn(nodes, ignoreSet);

      expect(testFn({ id: "A", inputs: ["1", "4", "missing"] })).toBe(true);
      expect(testFn({ id: "B", inputs: ["2", "3", "foo"] })).toBe(false);
    });
  });

  describe("anyRelationsWithinFn", () => {
    it("correctory returns when the input list of nodes is empty", () => {
      const testFn = anyRelationsWithinFn<{ id: string; inputs: string[] }>(
        [],
        {
          a: ["b", "c"],
          b: [],
          c: ["b"],
        }
      );
      expect(testFn({ id: "b", inputs: [] })).toBe(false);
      expect(testFn({ id: "a", inputs: ["c"] })).toBe(false);
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
        expect(testFn({ id: "2", inputs: ["0"] })).toBe(false);
      });
      it("correctly excludes nodes within the id set", () => {
        expect(testFn({ id: "1", inputs: ["0"] })).toBe(false);
        expect(testFn({ id: "C", inputs: ["A"] })).toBe(false);
      });
      it("correctly flags descendants", () => {
        expect(testFn({ id: "4", inputs: ["3", "2"] })).toBe(true);
      });
      it("correctly flags ancestors", () => {
        expect(testFn({ id: "A", inputs: [] })).toBe(true);
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
      expect(testFn({ id: "0", inputs: ["2"] })).toBe(true);
      expect(testFn({ id: "1", inputs: ["0"] })).toBe(true);
      expect(testFn({ id: "2", inputs: ["1"] })).toBe(true);
      expect(testFn({ id: "3", inputs: ["2"] })).toBe(false);
      expect(testFn({ id: "4", inputs: ["3"] })).toBe(false);
    });
  });

  describe("isDescendedFromFn", () => {
    it("correctory returns when the input list of ids is empty", () => {
      const testFn = isDescendedFromFn([], { a: ["b", "c"], b: [], c: ["b"] });
      expect(testFn({ id: "b", inputs: [] })).toBe(false);
      expect(testFn({ id: "a", inputs: ["c"] })).toBe(false);
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
        expect(testFn({ id: "2", inputs: ["0"] })).toBe(false);
        expect(testFn({ id: "0", inputs: [] })).toBe(false);
        expect(testFn({ id: "A", inputs: [] })).toBe(false);
      });

      it("correctly excludes nodes within the id set", () => {
        expect(testFn({ id: "1", inputs: ["0"] })).toBe(false);
        expect(testFn({ id: "B", inputs: ["A"] })).toBe(false);
      });

      it("correctly flags descendants", () => {
        expect(testFn({ id: "4", inputs: ["3", "2"] })).toBe(true);
        expect(testFn({ id: "C", inputs: ["B"] })).toBe(true);
      });
    });
  });

  describe("containsDuplicates", () => {
    it("correctly returns false with an empty list", () => {
      expect(containsDuplicates([])).toBe(false);
    });
    it("correctly returns false with a list with no dupes", () => {
      expect(
        containsDuplicates([
          { id: "0", inputs: [] },
          { id: "1", inputs: ["0"] },
          { id: "2", inputs: ["0"] },
        ])
      ).toBe(false);
    });
    it("correctly returns true with a list with dupes", () => {
      expect(
        containsDuplicates([
          { id: "0", inputs: [] },
          { id: "1", inputs: ["0"] },
          { id: "0", inputs: ["1"] },
        ])
      ).toBe(true);
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
      ).toEqual({
        id: "3",
        inputs: ["0", "2", "missing"],
        inputIndices: [0, 2],
      });
    });
  });
});
