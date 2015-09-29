import Guesstimates from '../models/guesstimates.js'

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

export default function guesstimates(state = initialGuesstimates, action) {
  switch (action.type) {
  case 'ADD_METRIC':
    return (new Guesstimates(state)).change({metric: action.id}).state;
  case 'REMOVE_METRIC':
    return (new Guesstimates(state)).remove(action.id).state;
  case 'CHANGE_GUESSTIMATE':
    return (new Guesstimates(state)).change(action.values).state;
  default:
    return state;
  }
}

