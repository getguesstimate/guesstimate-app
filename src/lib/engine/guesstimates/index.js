const PointDistribution = {
  name: 'pointDistribution',
  sample: function(guesstimate){return [5]},
  validationErrors: function(guesstimate, dGraph){return []},
  isA: function(guesstimate){return true},
}

const NormalDistribution = {
  name: 'normalDistribution',
  sample: function(guesstimate){return [5]},
  validationErrors: function(guesstimate, dGraph){return []},
  isA: function(guesstimate){return true},
}

//'input', 'max', 'min', 'distributionType', 'low', 'high', 'value'
const Distribution = {
  name: 'distribution',
  sample: function(e, b){return [5]},
  validationErrors: function(guesstimate, dGraph){return []},
  isA: function(guesstimate){return true},
  type: function(guesstimate){
    if (guesstimate.input && guesstimate.input !== '') {
      DistributionInput.getType(guesstimate.input)
    }
  },
}

const Funct = {
  name: 'function',
  sample: function(e, b){return [5]},
  validationErrors: function(guesstimate, dGraph){return []},
  isA: function(guesstimate){
    const {input} = guesstimate;
    return (_.isString(input) && (input !== '') && (input[0] === '='));
  },

}

function guesstimateType(guesstimate) {
  if (Func.isA(guesstimate)) {
    return 'function'
  } else if (Distribution.isA(guesstimate)){
    return 'distribution'
  } else {
    return 'unparseable'
  }
}

export function _sample(guesstimate: Guesstimate, dGraph: DGraph, n: number = 1): Object{
  const type = Distribution
  return type.sample(guesstimate, dGraph)
}

export function validationErrors(guesstimate: Guesstimate, dGraph: DGraph) {
  const type = guesstimateType(guesstimate)
  if (type === null) {
    return ['unparseable']
  }

  if (type === 'function') {
    return type.validationErrors(guesstimate, dGraph)
  } else {
    return type.validationErrors(guesstimate)
  }
}

function isValid(guesstimate: Guesstimate, dGraph: DGraph): boolean{
  validationErrors(guesstimate, dGraph).length === 0
}
