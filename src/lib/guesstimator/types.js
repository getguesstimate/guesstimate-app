import {Sampler as DistributionNormalSampler} from './samplers/DistributionNormal.js'
import {Sampler as DistributionPointSampler} from './samplers/DistributionPoint.js'
import {Sampler as DistributionUniformSampler} from './samplers/DistributionUniform.js'
import {Sampler as FunctionSampler} from './samplers/Function.js'

export const Funct = {
  referenceName: 'FUNCTION',
  types: ['FUNCTION'],
  displayName: 'Function',
  sampler: FunctionSampler
}

export const DistributionNormal = {
  referenceName: 'NORMAL',
  types: ['DISTRIBUTION', 'NORMAL'],
  displayName: 'Normal',
  sampler: DistributionNormalSampler
}

export const DistributionPoint = {
  referenceName: 'POINT',
  types: ['DISTRIBUTION', 'POINT'],
  displayName: 'Point',
  sampler: DistributionPointSampler
}

export const DistributionLognormal = {
  referenceName: 'LOGNORMAL',
  types: ['DISTRIBUTION', 'LOGNORMAL'],
  displayName: 'LogNormal',
  sampler: DistributionNormalSampler
}


export const DistributionUniform = {
  referenceName: 'UNIFORM',
  types: ['DISTRIBUTION', 'UNIFORM'],
  displayName: 'Uniform',
  sampler: DistributionUniformSampler
}

export const types = [
  Funct,
  DistributionNormal,
  DistributionPoint,
  DistributionLognormal,
  DistributionUniform
]

export function find(referenceName) {
  return types.find(e => e.referenceName === referenceName)
}
