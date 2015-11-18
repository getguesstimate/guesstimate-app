import {Sampler as DistributionNormalSampler} from './samplers/DistributionNormal.js'
import {Sampler as DistributionPointSampler} from './samplers/DistributionPoint.js'
import {Sampler as DistributionUniformSampler} from './samplers/DistributionUniform.js'
import {Sampler as FunctionSampler} from './samplers/Function.js'

import NormalIcon from '../../assets/distribution-icons/normal.png'
import LogNormalIcon from '../../assets/distribution-icons/lognormal.png'
import ExponentialIcon from '../../assets/distribution-icons/exponential.png'
import PointIcon from '../../assets/distribution-icons/point.png'
import UniformIcon from '../../assets/distribution-icons/uniform.png'
import FunctionIcon from '../../assets/distribution-icons/function.png'

export const Funct = {
  referenceName: 'FUNCTION',
  types: ['FUNCTION'],
  displayName: 'Function',
  sampler: FunctionSampler,
  icon: FunctionIcon
}

export const NoneGuesstimate = {
  referenceName: 'NONE',
  types: [],
  displayName: 'NONE',
  sampler: DistributionNormalSampler
}

export const DistributionNormal = {
  referenceName: 'NORMAL',
  types: ['DISTRIBUTION', 'NORMAL'],
  displayName: 'Normal',
  sampler: DistributionNormalSampler,
  isRangeDistribution: true,
  icon: NormalIcon
}

export const DistributionPoint = {
  referenceName: 'POINT',
  types: ['DISTRIBUTION', 'POINT'],
  displayName: 'Point',
  sampler: DistributionPointSampler,
  icon: PointIcon
}

export const DistributionLognormal = {
  referenceName: 'LOGNORMAL',
  types: ['DISTRIBUTION', 'LOGNORMAL'],
  displayName: 'LogNormal',
  isRangeDistribution: true,
  sampler: DistributionNormalSampler,
  icon: LogNormalIcon
}


export const DistributionUniform = {
  referenceName: 'UNIFORM',
  types: ['DISTRIBUTION', 'UNIFORM'],
  displayName: 'Uniform',
  isRangeDistribution: true,
  sampler: DistributionUniformSampler,
  icon: UniformIcon
}

export const types = [
  Funct,
  DistributionNormal,
  DistributionPoint,
  DistributionLognormal,
  DistributionUniform,
  NoneGuesstimate
]

export function find(referenceName) {
  const found = types.find(e => e.referenceName === referenceName)
  return found || NoneGuesstimate
}
