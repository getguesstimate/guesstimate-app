import {jStat} from 'jstat'
import Sampling from 'discrete-sampling'

const bernoulli = p => Sampling.Bernoulli(p).draw()
const binomial = (n, p) => Sampling.Binomial(n,p).draw()
const poisson = (lambda) => Sampling.Poisson(lambda).draw()
const negBinomial = (r, p) => Sampling.NegBinomial(r, p).draw()

function triangular(min, max, mode = (min + max)/2) {
  const u = Math.random()
  if (u < (mode-min)/(max-min)) {
    return min + Math.sqrt(u*(max-min)*(mode-min))
  } else {
    return max - Math.sqrt((1-u)*(max-min)*(max-mode))
  }
}

// Source:
// http://www.mhnederlof.nl/doubletriangular.html
function doubleTriangular(min, max, mode = (min + max)/2) {
  const u = Math.random()
  if (u <= 0.5) {
    return min + (mode - min)*Math.sqrt(2*u)
  } else {
    return max - (max - mode)*Math.sqrt(2*(1-u))
  }
}

// Source:
// https://en.wikipedia.org/wiki/Beta_distribution#Transformations
function pert(min, max, mode = (min + max)/2, lambda = 4) {
  const width = max - min
  const a = 1 + lambda * ((mode - min)/width)
  const b = 1 + lambda * ((max - mode)/width)
  const p = jStat.beta.sample(a, b)
  return min + p*width
}

export const Distributions = {
  beta: jStat.beta.sample,
  centralF: jStat.centralF.sample,
  cauchy: jStat.cauchy.sample,
  chisquare: jStat.chisquare.sample,
  exponential: jStat.exponential.sample,
  invgamma: jStat.invgamma.sample,
  lognormal: jStat.lognormal.sample,
  normal: jStat.normal.sample,
  studentt: jStat.studentt.sample,
  weibull: jStat.weibull.sample,
  uniform: jStat.uniform.sample,
  gamma: jStat.gamma.sample,
  triangular,
  doubleTriangular,
  pert,
  bernoulli: bernoulli,
  if: bernoulli,
  test: bernoulli,
  binomial: binomial,
  poisson: poisson,
  negBinomial: negBinomial
}
