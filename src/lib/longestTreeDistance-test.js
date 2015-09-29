import {LongDistanceOrderer, allNodes, firstNodes, inputs, maxDistance, maxDistanceListToOrder} from './longestTreeDistance.js';
import {expect} from 'chai';

describe('longestTreeDistance', () => {
  describe('LongestDistanceOrderer', () => {
    it('iterate', () => {
      let orderer = new LongDistanceOrderer(edges)
      orderer._iterate()
      expect(Array.from(orderer.maxDistanceList)).to.deep.equal([['A1', 0]])
      expect(orderer._done()).to.equal(false)
      orderer._iterate()
      expect(Array.from(orderer.maxDistanceList)).to.deep.equal([['A1', 0], ['A3', 1]])
      expect(orderer._done()).to.equal(false)
      orderer._iterate()
      expect(Array.from(orderer.maxDistanceList)).to.deep.equal([['A1', 0], ['A2', 2], ['A3', 1], ['A4', 2]])
      expect(orderer._done()).to.equal(false)
      orderer._iterate()
      expect(Array.from(orderer.maxDistanceList)).to.deep.equal([['A1', 0], ['A2', 2], ['A3', 1], ['A4', 2], ['A5', 3]])
      expect(orderer._done()).to.equal(true)
    })

    it('run', () => {
      let orderer = new LongDistanceOrderer(edges)
      let result = orderer.run()
      expect(result).to.deep.equal([['A1', 0], ['A2', 2], ['A3', 1], ['A4', 2], ['A5', 3]])
    })

    it('order', () => {
      let orderer = new LongDistanceOrderer(edges)
      orderer.run()
      let result = orderer.order()
      expect(result).to.deep.equal(['A1', 'A3', 'A2', 'A4', 'A5'])
    })
  })
  let edges = [
    {input: 'A1', output: 'A2'},
    {input: 'A1', output: 'A3'},
    {input: 'A3', output: 'A2'},
    {input: 'A3', output: 'A4'},
    {input: 'A4', output: 'A5'},
  ]

  describe('#allNodes', () => {
    it('lists all Nodes', () => {
      expect(Array.from(allNodes(edges))).to.deep.equal(['A1', 'A2', 'A3', 'A4', 'A5'])
    })
  })

  describe('#firstNodes', () => {
    it('lists first nodes', () => {
      expect(Array.from(firstNodes(edges))).to.deep.equal(['A1'])
    })
  })

  describe('#inputs', () => {
    it('finds all inputs', () => {
      expect(inputs(edges, 'A2')).to.deep.equal(['A1', 'A3'])
    })
  })

  describe('#maxDistance', () => {
    it('when valid', () => {
      let maxDistanceList = new Map([['A1', 0], ['A3', 1]])
      expect(maxDistance(edges, maxDistanceList, 'A2')).to.equal(2)
    })

    it('when exists', () => {
      let maxDistanceList = new Map([['A1', 0], ['A3', 1]])
      expect(maxDistance(edges, maxDistanceList, 'A3')).to.equal(1)
    })

    it('when no outputs', () => {
      let maxDistanceList = new Map()
      expect(maxDistance(edges, maxDistanceList, 'A1')).to.equal(0)
    })

    it('when undefined', () => {
      let maxDistanceList = new Map()
      expect(maxDistance(edges, maxDistanceList, 'A3')).to.equal(undefined)
    })
  })

  describe('#maxDistanceListToOrder', () => {
    it('works', () => {
      let maxDistanceList = [['A1', 0], ['A2', 2], ['A3', 1], ['A4', 2]]
      let result = maxDistanceListToOrder(maxDistanceList)
      expect(result).to.deep.equal(['A1', 'A3', 'A2', 'A4'])
    })
  })
});
