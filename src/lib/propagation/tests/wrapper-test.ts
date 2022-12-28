import { getSubset } from "../wrapper";

import * as _collections from "gEngine/collections";
import { organizationReadableId } from "gEngine/organization";
import { expressionSyntaxPad } from "gEngine/guesstimate";

describe("getSubset", () => {
  const space1Metrics = [
    { id: 1, space: 1 },
    { id: 2, space: 1 },
  ];
  const space2Metrics = [
    { id: 3, space: 2 },
    { id: 4, space: 2 },
  ];
  const space3Metrics = [
    { id: 5, space: 3 },
    { id: 6, space: 3 },
  ];
  const space4Metrics = [
    { id: 7, space: 4 },
    { id: 8, space: 4 },
    { id: 9, space: 4 },
  ];
  const space5Metrics = [{ id: 10, space: 5 }];
  const space6Metrics = [{ id: 11, space: 6 }];

  const space1Guesstimates = [
    { metric: 1, expression: "1" },
    { metric: 2, expression: "=${fact:1}" },
  ];
  const space2Guesstimates = [
    { metric: 3, expression: "=${metric:4}" },
    { metric: 4, expression: "=${fact:1}" },
  ];
  const space3Guesstimates = [
    { metric: 5, expression: "=100" },
    { metric: 6, expression: "=@Chicago.population" },
  ];
  const space4Guesstimates = [
    { metric: 7, expression: "=${fact:4}" },
    { metric: 8, expression: "=100" },
    { metric: 9, expression: "=@Chicago.population" },
  ];
  const space5Guesstimates = [{ metric: 10, expression: "6" }];
  const space6Guesstimates = [{ metric: 11, expression: "=${fact:2}" }];

  const space1Sims = [
    { metric: 1, sample: { values: [], errors: [] } },
    { metric: 2, sample: { values: [], errors: [] } },
  ];
  const space2Sims = [
    { metric: 3, sample: { values: [], errors: [] } },
    { metric: 4, sample: { values: [], errors: [] } },
  ];
  const space3Sims = [
    { metric: 5, sample: { values: [], errors: [] } },
    { metric: 6, sample: { values: [], errors: [] } },
  ];
  const space4Sims = [
    { metric: 7, sample: { values: [], errors: [] } },
    { metric: 8, sample: { values: [], errors: [] } },
    { metric: 9, sample: { values: [], errors: [] } },
  ];
  const space5Sims = [{ metric: 10, sample: { values: [], errors: [] } }];
  const space6Sims = [{ metric: 11, sample: { values: [], errors: [] } }];

  const state = {
    canvasState: {
      editsAllowedManuallySet: false,
    },
    spaces: [
      {
        id: 1,
        organization_id: 1,
        imported_fact_ids: [1],
        exported_facts_count: 1,
      },
      {
        id: 2,
        organization_id: 1,
        imported_fact_ids: [1],
        exported_facts_count: 1,
      },
      {
        id: 3,
        organization_id: 1,
        imported_fact_ids: [7],
        exported_facts_count: 0,
      },
      {
        id: 5,
        organization_id: 1,
        imported_fact_ids: [],
        exported_facts_count: 1,
      },
      {
        id: 6,
        organization_id: 1,
        imported_fact_ids: [2],
        exported_facts_count: 1,
      },
      {
        id: 4,
        organization_id: 2,
        imported_fact_ids: [4],
        exported_facts_count: 2,
      },
    ],
    organizations: [{ id: 1 }, { id: 2 }],
    facts: {
      globalFacts: [
        {
          variable_name: "Chicago",
          children: [
            {
              variable_name: "population",
              simulation: {
                samples: [100],
                errors: [],
              },
            },
          ],
        },
      ],
      organizationFacts: [
        {
          variable_name: organizationReadableId({ id: 1 }),
          children: [
            {
              id: 1,
              expression: "3",
              imported_to_intermediate_space_ids: [1, 2],
            },
            { id: 2, metric_id: 1, exported_from_id: 1 },
            { id: 3, metric_id: 3, exported_from_id: 2 },
            { id: 7, expression: "100" },
            { id: 8, metric_id: 10, exported_from_id: 5 },
            { id: 9, metric_id: 11, exported_from_id: 6 },
          ],
        },
        {
          variable_name: organizationReadableId({ id: 2 }),
          children: [
            { id: 4, expression: "3", imported_to_intermediate_space_ids: [4] },
            { id: 5, metric_id: 8, exported_from_id: 4 },
            { id: 6, metric_id: 9, exported_from_id: 4 },
          ],
        },
      ],
    },
    metrics: [
      ...space1Metrics,
      ...space2Metrics,
      ...space3Metrics,
      ...space4Metrics,
      ...space5Metrics,
      ...space6Metrics,
    ],
    guesstimates: [
      ...space1Guesstimates,
      ...space2Guesstimates,
      ...space3Guesstimates,
      ...space4Guesstimates,
      ...space5Guesstimates,
      ...space6Guesstimates,
    ],
    simulations: [
      ...space1Sims,
      ...space2Sims,
      ...space3Sims,
      ...space4Sims,
      ...space5Sims,
      ...space6Sims,
    ],
  };

  describe("getSubset should correctly extract a single space's subset, through metricId or spaceId", () => {
    const testCases = [
      {
        description:
          "Passing a single metricId should yield that metric's space's subset",
        graphFilters: { metricId: 1 },
      },
      {
        description:
          "Passing a single spaceId should yield that space's subset",
        graphFilters: { spaceId: 1 },
      },
    ];

    testCases.forEach(({ graphFilters, description }) => {
      describe(description, () => {
        const { subset, relevantFacts } = getSubset(state, graphFilters);

        test("metrics match", () => {
          expect(subset).toHaveProperty("metrics", space1Metrics);
        });
        test("guesstimates match", () => {
          expect(subset).toHaveProperty("guesstimates", space1Guesstimates);
        });
        test("simulations match", () => {
          expect(subset).toHaveProperty("simulations", space1Sims);
        });
        test("relevantFacts match", () => {
          expect(relevantFacts).toEqual([
            {
              id: 1,
              expression: "3",
              imported_to_intermediate_space_ids: [1, 2],
              shouldBeSimulated: false,
            },
            {
              id: 2,
              metric_id: 1,
              exported_from_id: 1,
              expression: `=${expressionSyntaxPad(1)}`,
              shouldBeSimulated: true,
            },
          ]);
        });
      });
    });
  });

  describe("getSubset should correctly extract a single space's subset, through metricId or spaceId, and flags all facts as unsimulatable when canvasState forbids edits.", () => {
    const testCases = [
      {
        description:
          "Passing a single metricId should yield that metric's space's subset",
        graphFilters: { metricId: 1 },
      },
      {
        description:
          "Passing a single spaceId should yield that space's subset",
        graphFilters: { spaceId: 1 },
      },
    ];

    const stateWithCanvasStateToFalse = {
      ...state,
      canvasState: {
        editsAllowed: false,
        editsAllowedManuallySet: true,
      },
    };

    testCases.forEach(({ graphFilters, description }) => {
      describe(description, () => {
        const { subset, relevantFacts } = getSubset(
          stateWithCanvasStateToFalse,
          graphFilters
        );

        test("metrics match", () => {
          expect(subset).toHaveProperty("metrics", space1Metrics);
        });
        test("guesstimates match", () => {
          expect(subset).toHaveProperty("guesstimates", space1Guesstimates);
        });
        test("simulations match", () => {
          expect(subset).toHaveProperty("simulations", space1Sims);
        });
        test("relevantFacts match", () => {
          expect(relevantFacts).toEqual([
            {
              id: 1,
              expression: "3",
              imported_to_intermediate_space_ids: [1, 2],
              shouldBeSimulated: false,
            },
            {
              id: 2,
              metric_id: 1,
              exported_from_id: 1,
              expression: `=${expressionSyntaxPad(1)}`,
              shouldBeSimulated: false,
            },
          ]);
        });
      });
    });
  });

  describe("getSubset should correctly extract a single space's subset, through metricId or spaceId, and flags facts as simulatable as appropriate when canvasState specifically allows edits.", () => {
    const testCases = [
      {
        description:
          "Passing a single metricId should yield that metric's space's subset",
        graphFilters: { metricId: 1 },
      },
      {
        description:
          "Passing a single spaceId should yield that space's subset",
        graphFilters: { spaceId: 1 },
      },
    ];

    const stateWithCanvasStateToFalse = {
      ...state,
      canvasState: {
        editsAllowed: true,
        editsAllowedManuallySet: true,
      },
    };

    testCases.forEach(({ graphFilters, description }) => {
      describe(description, () => {
        const { subset, relevantFacts } = getSubset(
          stateWithCanvasStateToFalse,
          graphFilters
        );

        test("metrics match", () => {
          expect(subset).toHaveProperty("metrics", space1Metrics);
        });
        test("guesstimates match", () => {
          expect(subset).toHaveProperty("guesstimates", space1Guesstimates);
        });
        test("simulations match", () => {
          expect(subset).toHaveProperty("simulations", space1Sims);
        });
        test("relevantFacts match", () => {
          expect(relevantFacts).toEqual([
            {
              id: 1,
              expression: "3",
              imported_to_intermediate_space_ids: [1, 2],
              shouldBeSimulated: false,
            },
            {
              id: 2,
              metric_id: 1,
              exported_from_id: 1,
              expression: `=${expressionSyntaxPad(1)}`,
              shouldBeSimulated: true,
            },
          ]);
        });
      });
    });
  });

  describe("should correctly extract all possibly intermediate spaces' subsets from a factId", () => {
    const graphFilters = { factId: 1 };
    const { subset, relevantFacts } = getSubset(state, graphFilters);

    test("metrics match", () => {
      expect(subset).toHaveProperty("metrics", [
        ...space1Metrics,
        ...space2Metrics,
        ...space6Metrics,
      ]);
    });
    test("guesstimates match", () => {
      expect(subset).toHaveProperty("guesstimates", [
        ...space1Guesstimates,
        ...space2Guesstimates,
        ...space6Guesstimates,
      ]);
    });
    test("simulations match", () => {
      expect(subset).toHaveProperty("simulations", [
        ...space1Sims,
        ...space2Sims,
        ...space6Sims,
      ]);
    });

    test("relevantFacts match", () => {
      expect(relevantFacts).toEqual([
        {
          id: 1,
          expression: "3",
          imported_to_intermediate_space_ids: [1, 2],
          shouldBeSimulated: false,
        },
        {
          id: 2,
          metric_id: 1,
          exported_from_id: 1,
          expression: `=${expressionSyntaxPad(1)}`,
          shouldBeSimulated: true,
        },
        {
          id: 3,
          metric_id: 3,
          exported_from_id: 2,
          expression: `=${expressionSyntaxPad(3)}`,
          shouldBeSimulated: true,
        },
        {
          id: 9,
          metric_id: 11,
          exported_from_id: 6,
          expression: `=${expressionSyntaxPad(11)}`,
          shouldBeSimulated: true,
        },
      ]);
    });
  });

  describe("should correctly extract all possibly intermediate spaces' subsets from a factId and ignore the canvasState settings", () => {
    const graphFilters = { factId: 1 };
    const stateWithCanvasStateToFalse = {
      ...state,
      canvasState: {
        editsAllowed: false,
        editsAllowedManuallySet: true,
      },
    };
    const { subset, relevantFacts } = getSubset(
      stateWithCanvasStateToFalse,
      graphFilters
    );

    test("metrics match", () => {
      expect(subset).toHaveProperty("metrics", [
        ...space1Metrics,
        ...space2Metrics,
        ...space6Metrics,
      ]);
    });
    test("guesstimates match", () => {
      expect(subset).toHaveProperty("guesstimates", [
        ...space1Guesstimates,
        ...space2Guesstimates,
        ...space6Guesstimates,
      ]);
    });
    test("simulations match", () => {
      expect(subset).toHaveProperty("simulations", [
        ...space1Sims,
        ...space2Sims,
        ...space6Sims,
      ]);
    });

    test("relevantFacts match", () => {
      expect(relevantFacts).toEqual([
        {
          id: 1,
          expression: "3",
          imported_to_intermediate_space_ids: [1, 2],
          shouldBeSimulated: false,
        },
        {
          id: 2,
          metric_id: 1,
          exported_from_id: 1,
          expression: `=${expressionSyntaxPad(1)}`,
          shouldBeSimulated: true,
        },
        {
          id: 3,
          metric_id: 3,
          exported_from_id: 2,
          expression: `=${expressionSyntaxPad(3)}`,
          shouldBeSimulated: true,
        },
        {
          id: 9,
          metric_id: 11,
          exported_from_id: 6,
          expression: `=${expressionSyntaxPad(11)}`,
          shouldBeSimulated: true,
        },
      ]);
    });
  });

  describe("should correctly extract an empty subset for invalid graphFilters", () => {
    const testCases = [
      {
        description: "an invalid metricId should yield an empty subset",
        graphFilters: { metricId: -1 },
      },
      {
        description: "an invalid spaceId should yield an empty subset",
        graphFilters: { spaceId: -1 },
      },
      {
        description: "empty graphFilters should yield an empty subset",
        graphFilters: {},
      },
      {
        description:
          "a factId with no imported_to_intermediate_space_ids should yield an empty subset",
        graphFilters: { factId: 2 },
      },
    ];

    testCases.forEach(({ graphFilters, description }) => {
      describe(description, () => {
        const { subset, relevantFacts } = getSubset(state, graphFilters);

        test("metrics are empty", () => {
          expect(subset).toHaveProperty("metrics", []);
        });
        test("guesstimates are empty", () => {
          expect(subset).toHaveProperty("guesstimates", []);
        });
        test("simulations are empty", () => {
          expect(subset).toHaveProperty("simulations", []);
        });
        test("relevantFacts are empty", () => {
          expect(relevantFacts).toEqual([]);
        });
      });
    });
  });
});
