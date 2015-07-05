import Collection from 'ampersand-rest-collection'
import Repo from './repo'

export default Collection.extend({
  model: Repo,

  initialize () {
    this.add([
      {
        name: 'people-in-nyc',
        data: {
          nodes: [
            {pid: 11, nodeType: 'estimate', name: 'people in NYC', value: 10000000},
            {pid: 2, nodeType: 'estimate', name: 'families per person', value: 0.3},
            {pid: 3, nodeType: 'estimate', name: 'pianos per family', value: 0.1},
            {pid: 4, nodeType: 'estimate', name: 'piano tuners per family', value: 0.001},
            {pid: 5, nodeType: 'dependent', name: 'families in NYC'},
            {pid: 6, nodeType: 'dependent', name: 'pianos in NYC'},
            {pid: 7, nodeType: 'dependent', name: 'piano tuners in NYC'},
            {pid: 8, nodeType: 'function', functionType: 'multiplication'},
            {pid: 9, nodeType: 'function', functionType: 'multiplication'},
            {pid: 10, nodeType: 'function', functionType: 'multiplication'},
          ],
          edges: [
            [11,8],
            [2,8],
            [8,5],
            [5,9],
            [3,9],
            [9,6],
            [6,10],
            [4,10],
            [10,7],
          ]
        }
      },
      {
        name: 'people-in-suburbs',
        data: {
          nodes: [
            {pid: 11, nodeType: 'estimate', name: 'people in Suburbs', value: 10000000},
            {pid: 2, nodeType: 'estimate', name: 'families per person', value: 0.3},
            {pid: 3, nodeType: 'estimate', name: 'pianos per family', value: 0.1},
            {pid: 4, nodeType: 'estimate', name: 'piano tuners per family', value: 0.001},
            {pid: 5, nodeType: 'dependent', name: 'families in Suburbs'},
            {pid: 6, nodeType: 'dependent', name: 'pianos in Suburbs'},
            {pid: 7, nodeType: 'dependent', name: 'piano tuners in Suburbs'},
            {pid: 8, nodeType: 'function', functionType: 'multiplication'},
            {pid: 9, nodeType: 'function', functionType: 'multiplication'},
            {pid: 10, nodeType: 'function', functionType: 'multiplication'},
          ],
          edges: [
            [11,8],
            [2,8],
            [8,5],
            [5,9],
            [3,9],
            [9,6],
            [6,10],
            [4,10],
            [10,7],
          ]
        }
      }
    ])
  },

  getByName (name) {
    let model = this.findWhere({name: name})
    return model
  }
})
