import {jStat} from 'jstat'
import {Sampling} from 'discrete-sampling'

function bernoulli(p) {
  var s = Sampling.Bernoulli(p)
  return s.draw()
}

function binomial(n, p) {
  var s = Sampling.Binomial(n,p)
  return s.draw()
}

function poisson(lambda) {
  var s = Sampling.Poisson(lambda)
  return s.draw()
}

function discrete(probabilities) {
  var s = Sampling.Discrete(probabilities)
  return s.draw()
}

function multinomial(n, ps) {
  var s = Sampling.Multinomial(n, ps)
  return s.draw()
}

function negBinomial(r, p) {
  var s = Sampling.negBinomial(r,p)
  return s.draw()
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
  bernoulli: bernoulli,
  test: bernoulli,
  binomial: binomial,
  poisson: poisson,
  multinomial: multinomial,
  negBinomial: negBinomial,
  discrete: discrete
}
