import _ from 'lodash';

let initialGuesstimates = [
  {
    metric: '238jdj',
    input: '5000/50'
  },
  {
    metric: '8sdjf8sjddf',
    input: '= PNYC '
  },
  {
    metric: '238iojic',
    input: '= PNYC + 32'
  },
  {
    metric: '238iojib',
    input: '=42'
  },
  {
    metric: '238iojia',
    input: '32/3'
  },
  {
    metric: '238iojid',
    input: '32/3'
  },
  {
    metric: '238ioji3',
    input: '32/3'
  }
];

export default function guesstimates(state = [], action) {
  switch (action.type) {
  case 'SPACES_FETCH_SUCCESS':
    let newGuesstimates = _.flatten(action.records.map(e => _.get(e, 'graph.guesstimates'))).filter(e => e)
    return [...state, ...newGuesstimates]
  case 'ADD_METRIC':
    return [...state, {metric: action.item.id, input: ''}]
  case 'REMOVE_METRIC':
    return state.filter(y => y.metric !== action.item.id)
  case 'CHANGE_GUESSTIMATE':
    const i = state.findIndex(y => y.metric === action.values.metric);
    if (i !== -1) {
      return [
        ...state.slice(0, i),
        action.values,
        ...state.slice(i+1, state.length)
      ];
    }
  default:
    return state;
  }
}

