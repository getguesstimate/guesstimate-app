import {expect} from 'chai'

import * as utils from './utils'

import {getSubset} from '../wrapper'

import * as _collections from 'gEngine/collections'
import {organizationReadableId} from 'gEngine/organization'
import {expressionSyntaxPad} from 'gEngine/guesstimate'

describe('getSubset', () => {
  const state = {
    spaces: [
      {
        id: 1,
        organization_id: 1,
        imported_facts: [1],
        exported_facts_count: 1,
      },
      {
        id: 2,
        organization_id: 1,
        imported_facts: [1],
        exported_facts_count: 1,
      },
      {
        id: 3,
        organization_id: 1,
        imported_facts: [7],
        exported_facts_count: 0,
      },
      {
        id: 5,
        organization_id: 1,
        imported_facts: [],
        exported_facts_count: 1,
      },
      {
        id: 4,
        organization_id: 2,
        imported_facts: [4],
        exported_facts_count: 2,
      },
    ],
    organizations: [
      {id: 1},
      {id: 2},
    ],
    facts: {
      globalFacts: [
        {
          variable_name: 'Chicago',
          children: [
            {
              variable_name: 'population',
              simulation: {
                samples: [100],
                errors: [],
              },
            },
          ],
        }
      ],
      organizationFacts: [
        {
          variable_name: organizationReadableId({id: 1}),
          children: [
            {id: 1, expression: '3'},
            {id: 2, metric_id: 1, exporting_space_id: 1},
            {id: 3, metric_id: 3, exporting_space_id: 2},
            {id: 7, expression: '100'},
            {id: 8, metric_id: 10, exporting_space_id: 5},
          ],
        },
        {
          variable_name: organizationReadableId({id: 2}),
          children: [
            {id: 4, expression: '3'},
            {id: 5, metric_id: 8, exporting_space_id: 4},
            {id: 6, metric_id: 9, exporting_space_id: 4},
          ],
        },
      ],
    },
    metrics: [
      {id: 1, space: 1},
      {id: 2, space: 1},
      {id: 3, space: 2},
      {id: 4, space: 2},
      {id: 5, space: 3},
      {id: 6, space: 3},
      {id: 7, space: 4},
      {id: 8, space: 4},
      {id: 9, space: 4},
      {id: 10, space: 5},
    ],
    guesstimates: [
      {metric: 1, expression: '1'},
      {metric: 2, expression: '=${fact:1}'},
      {metric: 3, expression: '=${metric:4}'},
      {metric: 4, expression: '=${fact:1}'},
      {metric: 5, expression: '=100'},
      {metric: 6, expression: '=@Chicago.population'},
      {metric: 7, expression: '=${fact:4}'},
      {metric: 8, expression: '=100'},
      {metric: 9, expression: '=@Chicago.population'},
      {metric: 10, expression: '6'},
    ],
    simulations: [
      {metric: 1, sample: {values: [], errors: []}},
      {metric: 2, sample: {values: [], errors: []}},
      {metric: 3, sample: {values: [], errors: []}},
      {metric: 4, sample: {values: [], errors: []}},
      {metric: 5, sample: {values: [], errors: []}},
      {metric: 6, sample: {values: [], errors: []}},
      {metric: 7, sample: {values: [], errors: []}},
      {metric: 8, sample: {values: [], errors: []}},
      {metric: 9, sample: {values: [], errors: []}},
      {metric: 10, sample: {values: [], errors: []}},
    ],
  }

  it ("should correctly extract a single space's subset from spaceId", () => {
    const graphFilters = { spaceId: 1 }
    const {subset, relevantFacts} = getSubset(state, graphFilters)

    expect(subset, "The subset's metrics should match").to.have.property('metrics').that.deep.has.members([
      {id: 1, space: 1},
      {id: 2, space: 1},
    ])
    expect(subset, "The subset's guesstimates should match").to.have.property('guesstimates').that.deep.has.members([
      {metric: 1, expression: '1'},
      {metric: 2, expression: '=${fact:1}'},
    ])
    expect(subset, "The subset's simulations should match").to.have.property('simulations').that.deep.has.members([
      {metric: 1, sample: {values: [], errors: []}},
      {metric: 2, sample: {values: [], errors: []}},
    ])

    expect(relevantFacts, 'The relevantFacts should match').to.deep.have.members([
      {id: 1, expression: '3'},
      {id: 2, metric_id: 1, exporting_space_id: 1, expression: `=${expressionSyntaxPad(1)}`},
    ])
  })

  it ("should correctly extract a single space's subset from metricId", () => {
    const graphFilters = { metricId: 1 }
    const {subset, relevantFacts} = getSubset(state, graphFilters)

    expect(subset, "The subset's metrics should match").to.have.property('metrics').that.deep.has.members([
      {id: 1, space: 1},
      {id: 2, space: 1},
    ])
    expect(subset, "The subset's guesstimates should match").to.have.property('guesstimates').that.deep.has.members([
      {metric: 1, expression: '1'},
      {metric: 2, expression: '=${fact:1}'},
    ])
    expect(subset, "The subset's simulations should match").to.have.property('simulations').that.deep.has.members([
      {metric: 1, sample: {values: [], errors: []}},
      {metric: 2, sample: {values: [], errors: []}},
    ])

    expect(relevantFacts, 'The relevantFacts should match').to.deep.have.members([
      {id: 1, expression: '3'},
      {id: 2, metric_id: 1, exporting_space_id: 1, expression: `=${expressionSyntaxPad(1)}`},
    ])
  })

  it ("should correctly extract a single space's subset from factId", () => {
    const graphFilters = { factId: 1 }
    const {subset, relevantFacts} = getSubset(state, graphFilters)

    expect(subset, "The subset's metrics should match").to.have.property('metrics').that.deep.has.members([
      {id: 1, space: 1},
      {id: 2, space: 1},
      {id: 3, space: 2},
      {id: 4, space: 2},
    ])
    expect(subset, "The subset's guesstimates should match").to.have.property('guesstimates').that.deep.has.members([
      {metric: 1, expression: '1'},
      {metric: 2, expression: '=${fact:1}'},
      {metric: 3, expression: '=${metric:4}'},
      {metric: 4, expression: '=${fact:1}'},
    ])
    expect(subset, "The subset's simulations should match").to.have.property('simulations').that.deep.has.members([
      {metric: 1, sample: {values: [], errors: []}},
      {metric: 2, sample: {values: [], errors: []}},
      {metric: 3, sample: {values: [], errors: []}},
      {metric: 4, sample: {values: [], errors: []}},
    ])

    expect(relevantFacts, 'The relevantFacts should match').to.deep.have.members([
      {id: 1, expression: '3'},
      {id: 2, metric_id: 1, exporting_space_id: 1, expression: `=${expressionSyntaxPad(1)}`},
      {id: 3, metric_id: 3, exporting_space_id: 2, expression: `=${expressionSyntaxPad(3)}`},
    ])
  })
})
