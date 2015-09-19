import Metrics from '../models/metrics'

let initialMetrics = [
  {
    id: '238jd',
    readableId: 'CO',
    name: 'cowboys',
    location: {
      column: 3,
      row: 3
    }
  },
  {
    id: '8sdjf8sjdf',
    readableId: 'BA',
    name: 'Batmen',
    location: {
      column: 1,
      row: 1
    }
  },
  {
    id: '238ioji',
    readableId: 'PO',
    name: 'police',
    location: {
      column: 2,
      row: 2
    }
  }
]

export default function metrics(state = initialMetrics, action) {
  switch (action.type) {
  case 'ADD_METRIC':
    return (new Metrics(state)).create({id: action.id, location: action.location}).state;
  case 'REMOVE_METRIC':
    return (new Metrics(state)).remove(action.id).state;
  case 'CHANGE_METRIC':
    return (new Metrics(state)).change(action.id, action.values).state;
  default:
    return state
  }
}

