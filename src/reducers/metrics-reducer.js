import Metrics from '../models/metrics'

let initialMetrics = [
  {
    id: '238jdj',
    readableId: 'CO',
    name: 'People in NYC',
    location: {
      column: 0,
      row: 0
    }
  },
  {
    id: '8sdjf8sjddf',
    readableId: 'BA',
    name: 'Percent Attending K-12',
    location: {
      column: 0,
      row: 1
    }
  },
  {
    id: '238iojic',
    readableId: 'PO',
    name: 'Cost of a Teacher per Year',
    location: {
      column: 1,
      row: 1
    }
  },
  {
    id: '238iojib',
    readableId: 'PO',
    name: 'Students per Teacher',
    location: {
      column: 0,
      row: 2
    }
  },
  {
    id: '238iojia',
    readableId: 'PO',
    name: 'Additional Spending per Student Year',
    location: {
      column: 1,
      row: 2
    }
  },
  {
    id: '238iojid',
    readableId: 'PO',
    name: 'Total Spending per Student Year',
    location: {
      column: 2,
      row: 2
    }
  },
  {
    id: '238ioji3',
    readableId: 'PO',
    name: 'Total Spending per Year',
    location: {
      column: 2,
      row: 3
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

