import Metrics from '../models/metrics'

let initialMetrics = [
  {
    id: '238jd',
    readableId: 'CO',
    name: 'cowboys',
    guesstimate: {
      input: '= BA + PO + 2',
      distribution: {
        mean: 100,
        stdev: 4
      },
    },
    location: {
      column: 3,
      row: 3
    }
  },
  {
    id: '8sdjf8sjdf',
    readableId: 'BA',
    name: 'Batmen',
    guesstimate: {
      input: '32/3',
      distribution: {
        mean: 32,
        stdev: 3
      },
    },
    location: {
      column: 1,
      row: 1
    }
  },
  {
    id: '238ioji',
    readableId: 'PO',
    name: 'police',
    guesstimate: {
      input: '100/4',
      distribution: {
        mean: 100,
        stdev: 4
      },
    },
    location: {
      column: 2,
      row: 2
    }
  },
]

export default function metrics(state = initialMetrics, action) {
  switch (action.type) {
  case 'ADD_METRIC':
    return (new Metrics(state)).add({location: action.location, id: action.id}).state
  case 'REMOVE_METRIC':
    return (new Metrics(state)).remove(action.id).state
  case 'CHANGE_METRIC_NAME':
    return (new Metrics(state)).update(action.id, {name: action.name}).state
  default:
    return state
  }
}

