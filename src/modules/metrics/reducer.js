let initialMetrics = [
  {
    id: '238jdj',
    readableId: 'PNYC',
    name: 'People in NYC',
    location: {
      column: 0,
      row: 0
    }
  },
  {
    id: '8sdjf8sjddf',
    readableId: 'PA',
    name: 'Percent Attending K-12',
    location: {
      column: 0,
      row: 1
    }
  },
  {
    id: '238iojic',
    readableId: 'TPY',
    name: 'Cost of a Teacher per Year',
    location: {
      column: 1,
      row: 1
    }
  },
  {
    id: '238iojib',
    readableId: 'SPT',
    name: 'Students per Teacher',
    location: {
      column: 0,
      row: 2
    }
  },
  {
    id: '238iojia',
    readableId: 'ASPY',
    name: 'Additional Spending per Student Year',
    location: {
      column: 1,
      row: 2
    }
  },
  {
    id: '238iojid',
    readableId: 'TSSY',
    name: 'Total Spending per Student Year',
    location: {
      column: 2,
      row: 2
    }
  },
  {
    id: '238ioji3',
    readableId: 'TSY',
    name: 'Total Spending per Year',
    location: {
      column: 2,
      row: 3
    }
  }
];
export default function metrics(state = initialMetrics, action) {
  switch (action.type) {
  case 'ADD_METRIC':
    return [...state, action.item]
  case 'REMOVE_METRIC':
    return state.filter(y => y.id !== action.item.id)
  case 'CHANGE_METRIC':
    const i = state.findIndex(y => y.id === action.item.id);
    if (i !== -1) {
      return [
        ...state.slice(0, i),
        action.item,
        ...state.slice(i+1, state.length)
      ];
    }
  default:
    return state
  }
}

