import Guesstimates from '../models/guesstimates.js'

let initialGuesstimates = [
  {
    metric: '238jd',
    input: '= BA + PO + 2',
    distribution: {
      mean: 100,
      stdev: 4
    },
  },
  {
    metric: '8sdjf8sjdf',
    input: '32/3',
    distribution: {
      mean: 32,
      stdev: 3
    },
  },
  {
    metric: '238ioji',
    distribution: {
      mean: 100,
      stdev: 4
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

