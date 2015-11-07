function _simulator(guesstimate) {
  if (Func.isA(guesstimate)) {
    return Func.simulator(guesstimate)
  } else if (Distribution.isA(guesstimate)){
    return Distribution.simulator(guesstimate)
  } else {
    return 'unparseable'
  }
}

export function sample(guesstimate: Guesstimate, dGraph: DGraph, n: number = 1): Object{
  const simulator = _simulator(guesstimate)
  return simulator.sample(guesstimate, dGraph)
}
