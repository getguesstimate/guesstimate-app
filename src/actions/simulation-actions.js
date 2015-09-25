let sim = {
    metricId: 32323,
    sample: {
      values: [3,5,5,5,3,3,2],
      errors: []
    }
};

export function addPartialSimulation(simulation) {
    let foo = Array.from(new Array(50), (i) => Math.random(50) * 50);
    sim.sample.values = foo;
    return { type: 'UPDATE_SIMULATION', simulation: sim };
}
