import Guesstimates from '../models/guesstimates.js'

let initialGuesstimates = [
  {
    metric: '238jdj',
    input: '5000/50',
    distribution: {
      mean: 5000,
      stdev: 50
    },
  },
  {
    metric: '8sdjf8sjddf',
    input: '=PNYC ',
    distribution: {
      input: '=PNYC*45',
    },
  },
  {
    metric: '238iojic',
    input: '= PNYC + 32',
    distribution: {
      input: '=PA + 50',
    },
  },
  {
    metric: '238iojib',
    input: '=42',
    distribution: {
      input: '=42',
    },
  },
  {
    metric: '238iojia',
    input: '32/3',
    distribution: {
      mean: 32,
      stdev: 3
    },
  },
  {
    metric: '238iojid',
    input: '32/3',
    distribution: {
      mean: 32,
      stdev: 3
    },
  },
  {
    metric: '238ioji3',
    input: '32/3',
    distribution: {
      mean: 32,
      stdev: 3
    },
  }
];

export default function guesstimates(state = initialGuesstimates, action) {
  switch (action.type) {
  case 'ADD_METRIC':
    return (new Guesstimates(state)).create(action.id).state;
  case 'REMOVE_METRIC':
    return (new Guesstimates(state)).remove(action.id).state;
  case 'CHANGE_GUESSTIMATE':
    return (new Guesstimates(state)).change(action.id, action.values).state;
  default:
    return state;
  }
}

