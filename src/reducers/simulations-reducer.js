import e from '../lib/engine/engine'

export default function simulations(state = [], action) {
  switch (action.type) {
  case 'UPDATE_SIMULATION':
    let sim = action.simulation;
    let i = state.findIndex(y => y.metric === sim.metric);
    console.log('running reducer')
    if (i !== -1) {
      return [
        ...state.slice(0, i),
        e.simulation.combine([state[i], sim]),
        ...state.slice(i+1, state.length)
      ];
    } else {
      return [...state, sim]
    };
  default:
    return state
  }
}
