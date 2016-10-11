import {expect} from 'chai'

import {
  getAncestors,
  getCycleSets,
  toCyclePseudoNode,
  getMissingInputs,
  separateIntoHeightSets,
  separateIntoDisconnectedComponents
} from './DAG'

describe('DAG library', () => {
  const layeredGraphNodes = [
    {id: 'A', inputs: []},
    {id: 'B', inputs: ['A']},
    {id: 'C', inputs: ['A']},
    {id: 'D', inputs: ['B']},
    {id: 'E', inputs: ['B']},
    {id: 'F', inputs: ['C']},
    {id: 'G', inputs: ['F', 'D']},
    {id: 'H', inputs: ['I']},
    {id: 'I', inputs: ['H', 'A']},
    {id: 'J', inputs: ['G', 'I']},
    {id: 'K', inputs: []},
    {id: 'L', inputs: ['K']},
    {id: 'M', inputs: ['K']},
    {id: 'N', inputs: ['M', 'L']},
  ]
  describe('getAncestors', () => {
    it ('Correctly assigns nodes their relations', () => {
      const ancestors = getAncestors(layeredGraphNodes)
      expect(ancestors['I']).to.have.members(['H', 'I', 'A'])
      expect(ancestors['I'].length).to.eq(3)

      expect(ancestors['J']).to.have.members(['G', 'I', 'H', 'A', 'F', 'D', 'C', 'B'])
      expect(ancestors['J'].length).to.eq(8)

      expect(ancestors['A']).to.have.members([])

      expect(ancestors['B']).to.have.members(['A'])
      expect(ancestors['B'].length).to.eq(1)

      expect(ancestors['N']).to.have.members(['K', 'L', 'M'])
      expect(ancestors['N'].length).to.eq(3)
    })
  })

  const withCycles = [
    {id: 'A', inputs: ['G']},
    {id: 'B', inputs: ['A']},
    {id: 'C', inputs: ['B']},
    {id: 'D', inputs: ['C']},
    {id: 'E', inputs: ['D', 'K']},
    {id: 'F', inputs: ['E']},
    {id: 'G', inputs: ['F']},
    {id: 'H', inputs: ['K']},
    {id: 'I', inputs: ['H']},
    {id: 'J', inputs: ['I']},
    {id: 'K', inputs: ['J']},
    {id: '1', inputs: []},
    {id: '2', inputs: ['1']},
    {id: '3', inputs: ['1']}
  ]
  describe('getCycleSets', () => {
    const ancestors = getAncestors(withCycles)
    const {acyclicNodes, cycleSets} = getCycleSets(withCycles, ancestors)

    it ('Correctly extracts cycles', () => {
      expect(acyclicNodes).to.deep.have.members([
        {id: '1',     inputs: []},
        {id: '2',     inputs: ['1']},
        {id: '3',     inputs: ['1']},
      ])
      expect(cycleSets).to.deep.have.members([
        [
          {id: 'A', inputs: ['G']},
          {id: 'B', inputs: ['A']},
          {id: 'C', inputs: ['B']},
          {id: 'D', inputs: ['C']},
          {id: 'E', inputs: ['D', 'K']},
          {id: 'F', inputs: ['E']},
          {id: 'G', inputs: ['F']}
        ], [
          {id: 'H', inputs: ['K']},
          {id: 'I', inputs: ['H']},
          {id: 'J', inputs: ['I']},
          {id: 'K', inputs: ['J']}
        ],
      ])
    })

    const cyclePseudoNodes = cycleSets.map(toCyclePseudoNode)
    it ('correctly makes psuedo nodes', () => {
      expect(cyclePseudoNodes).to.deep.have.members([
        {
          id: null,
          isCycle: true,
          inputs: ['K'],
          dependants: [],
          nodes: [
            {id: 'A', inputs: ['G']},
            {id: 'B', inputs: ['A']},
            {id: 'C', inputs: ['B']},
            {id: 'D', inputs: ['C']},
            {id: 'E', inputs: ['D', 'K']},
            {id: 'F', inputs: ['E']},
            {id: 'G', inputs: ['F']}
          ],
        }, {
          id: null,
          isCycle: true,
          inputs: [],
          dependants: [],
          nodes: [
            {id: 'H', inputs: ['K']},
            {id: 'I', inputs: ['H']},
            {id: 'J', inputs: ['I']},
            {id: 'K', inputs: ['J']}
          ]
        },
      ])
    })
  })

  describe('getMissingInputs', () => {
    const nodes = [
      {id: '1', inputs: []},
      {id: '2', inputs: ['missing', 'missing']},
      {id: '3', inputs: ['1', '2']},
      {id: '4', inputs: ['2', '3', 'missing']},
      {id: '5', inputs: ['3', '4', 'gone', 'not']}
    ]

    it('extracts missing inputs', () => {
      const missingInputs = getMissingInputs(nodes)
      expect(missingInputs).to.have.members(['missing', 'gone', 'not'])
    })
  })

  describe('separateIntoHeightSets', () => {
    const nodesToSeparate = [
      {id: '0', inputs: []},
      {id: '1', inputs: []},
      {id: '2', inputs: ['1']},
      {id: '3', inputs: ['1']},
      {id: null, isCycle: true, inputs: ['3'], nodes: [{id: '4', inputs: ['3', '5']}, {id: '5', inputs: ['4']}]},
      {id: '6', inputs: ['3']},
      {id: '7', inputs: ['1', '6']},
      {id: '8', inputs: ['5', '4', 'missing']},
    ]

    it('separates into proper height sets', () => {
      const heightSets = separateIntoHeightSets(nodesToSeparate)
      expect(heightSets).to.deep.equal([
        [{id: '0', inputs: []}, {id: '1', inputs: []}],
        [{id: '2', inputs: ['1']}, {id: '3', inputs: ['1']}],
        [
          {id: null, isCycle: true, inputs: ['3'], nodes: [{id: '4', inputs: ['3', '5']}, {id: '5', inputs: ['4']}]},
          {id: '6', inputs: ['3']}
        ],
        [{id: '7', inputs: ['1', '6']}, {id: '8', inputs: ['5', '4', 'missing']}],
      ])
    })
  })

  describe('separateIntoDisconnectedComponents', () => {
    const nodes = [
      {id: '1', inputs: []},
      {id: '2', inputs: ['1']},
      {id: '3', inputs: ['1']},
      {id: '4', inputs: []},
      {id: '5', inputs: ['4']},
      {id: '6', inputs: ['4', '5']},
    ]

    const ancestors = getAncestors(nodes)
    const components = separateIntoDisconnectedComponents(nodes, ancestors)
    expect(components).to.have.length(2)
    expect(components[0]).to.deep.have.members([
      {id: '1', inputs: []},
      {id: '2', inputs: ['1']},
      {id: '3', inputs: ['1']},
    ])
    expect(components[1]).to.deep.have.members([
      {id: '4', inputs: []},
      {id: '5', inputs: ['4']},
      {id: '6', inputs: ['4', '5']},
    ])
  })
})
