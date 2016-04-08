import {expect} from 'chai';

import BasicGraph from './basic-graph.js'

describe('Graph', () => {
  let inputs = {
    // Structure:
    //       1
    //      /|
    //     2 |
    //      \|
    //       3
    //       |
    //       4
    nodeIds: [1,2,3,4,5],
    nodeEdges: [
      {input: 1, output: 2},
      {input: 2, output: 3},
      {input: 1, output: 3},
      {input: 3, output: 4}
    ]
  }

  let graph = new BasicGraph(inputs.nodeIds, inputs.nodeEdges)

  let longInputs = {
    // Structure:
    //  1  2  3  4
    //   \ |  | /
    //    \|  |/
    //     \  /
    //      \/
    //   5   6
    //    \  |
    //     \ |
    //      \|
    //       7
    //       |
    //       8
    //       |
    //       9
    nodeIds: [1,2,3,4,5,6,7,8,9],
    nodeEdges: [
      {input: 1, output: 6},
      {input: 2, output: 6},
      {input: 3, output: 6},
      {input: 4, output: 6},
      {input: 5, output: 7},
      {input: 6, output: 7},
      {input: 7, output: 8},
      {input: 8, output: 9},
    ]
  }
  let longGraph = new BasicGraph(longInputs.nodeIds, longInputs.nodeEdges)

  let deepInputs = {
    // Structure:
    //  1  2  3  4
    //  | /| /  /
    //  |/ |/  /
    //  5  /  /
    //  | /  /
    //  |/  /
    //  6  /
    //  | /
    //  |/
    //  7
    //  |
    //  8
    nodeIds: [1,2,3,4,5,6,7,8],
    nodeEdges: [
      {input: 1, output: 5},
      {input: 2, output: 5},
      {input: 2, output: 6},
      {input: 3, output: 6},
      {input: 5, output: 6},
      {input: 4, output: 7},
      {input: 6, output: 7},
      {input: 7, output: 8},
    ]
  }
  let deepGraph = new BasicGraph(deepInputs.nodeIds, deepInputs.nodeEdges)


  describe('#constructor', () => {
    it('contains nodes', () => {
      expect(graph.nodes.length).to.equal(5)
      expect(graph.nodes[0].graph).to.deep.equal(graph)
      expect(graph.nodes[0].id).to.deep.equal(1)
    })
  })

  describe('#children', () => {
    it('for input 1', () => {
      const subset = graph.subsetFrom(1)
      expect(subset.nodes.map(n => n.id)).to.deep.equal([1,2,3,4])
      expect(subset.edges).to.deep.equal(
        [
          {input: 1, output: 2},
          {input: 2, output: 3},
          {input: 1, output: 3},
          {input: 3, output: 4}
        ]
      )
    })

    it('for input 3', () => {
      const subset = graph.subsetFrom(3)
      expect(subset.nodes.map(n => n.id)).to.deep.equal([3, 4])
      expect(subset.edges).to.deep.equal(
        [
          {input: 3, output: 4}
        ]
      )
    })

    it('for input 4', () => {
      const subset = graph.subsetFrom(4)
      expect(subset.nodes.map(n => n.id)).to.deep.equal([4])
      expect(subset.edges).to.deep.equal([])
    })
  })

  describe('#children', () => {
    describe('oneLevel=true', () => {
      it('with children', () => {
        expect(graph.childrenIds(1)).to.deep.equal([2,3])
      })

      it('with no children', () => {
        expect(graph.children(1).map(c => c.id)).to.deep.equal([2, 3])
        expect(graph.children(2).map(c => c.id)).to.deep.equal([3])
      })
    })

    describe('oneLevel=false', () => {
      it('with children', () => {
        expect(graph.childrenIds(1, false)).to.deep.equal([2,3,4])
      })

      it('with no children', () => {
        expect(graph.children(4, false)).to.deep.equal([])
      })

      it('long graph', () => {
        expect(longGraph.childrenIds(3, false)).to.deep.have.members([6,7,8,9])
      })

      it('deep graph', () => {
        expect(deepGraph.childrenIds(2, false)).to.deep.have.members([5,6,7,8])
      })
    })
  })
})

describe('BasicNode', () => {
  let inputs = {
    nodeIds: [1,2,3,4,5],
    nodeEdges: [
      {input: 1, output: 2},
      {input: 2, output: 3},
      {input: 1, output: 3},
      {input: 3, output: 4}
    ]
  }

  let graph = new BasicGraph(inputs.nodeIds, inputs.nodeEdges)

  describe('#maxDistanceFromRoot', () => {
      it('works', () => {
        const allDistances = graph.nodes.map(n => n.maxDistanceFromRoot)
        expect(allDistances).to.deep.equal([0, 1, 2, 3, 0])
      })
  })
})

