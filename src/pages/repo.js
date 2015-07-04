import React from 'react'
import App from '../../scripts/flux/components/app'

export default React.createClass({
  displayName: 'ModelPage',
  render () {
    const data = {
      nodes: [
        {pid: 11, nodeType: 'estimate', name: 'people in NYC', value: 10000000},
        {pid: 2, nodeType: 'estimate', name: 'families per person', value: 0.3},
        {pid: 3, nodeType: 'estimate', name: 'pianos per family', value: 0.1},
        {pid: 4, nodeType: 'estimate', name: 'piano tuners per family', value: 0.001},
        {pid: 5, nodeType: 'dependent', name: 'families in BOSTON'},
        {pid: 6, nodeType: 'dependent', name: 'pianos in BOSTON'},
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
    return (
      <App graphData = {data} />
    )
  }
})

