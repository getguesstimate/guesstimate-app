import {Sampler as DistributionNormalSampler} from './samplers/DistributionNormal.js'
import {Sampler as DistributionLognormalSampler} from './samplers/DistributionLognormal.js'
import {Sampler as DistributionBetaSampler} from './samplers/DistributionBeta.js'
import {Sampler as DistributionPointSampler} from './samplers/DistributionPoint.js'
import {Sampler as DistributionUniformSampler} from './samplers/DistributionUniform.js'
import {Sampler as FunctionSampler} from './samplers/Function.js'
import {Sampler as DataSampler} from './samplers/Data.js'
import {Sampler as NoneSampler} from './samplers/None.js'

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
  sampler: DistributionLognormalSampler,
  icon: LogNormalIcon
}

export const DistributionBeta = {
  referenceName: 'BETA',
  types: ['DISTRIBUTION', 'BETA'],
  displayName: 'Beta',
  isRangeDistribution: false,
  sampler: DistributionBetaSampler,
  icon: LogNormalIcon // Update
}


export const DistributionUniform = {
  referenceName: 'UNIFORM',
  types: ['DISTRIBUTION', 'UNIFORM'],
  displayName: 'Uniform',
  isRangeDistribution: true,
  sampler: DistributionUniformSampler,
  icon: UniformIcon
}

export const Data = {
  referenceName: 'DATA',
  types: ['DATA'],
  displayName: 'Data',
  isRangeDistribution: false,
  sampler: DataSampler,
  icon: UniformIcon
}

// Change to null Guesstimate for sampler
export const None = {
  referenceName: 'NONE',
  types: [],
  displayName: 'NONE',
  sampler: NoneSampler
}

const all = [
  Funct,
  DistributionNormal,
  DistributionBeta,
  DistributionPoint,
  DistributionLognormal,
  DistributionUniform,
  Data,
  None
]

export function find(referenceName) {
  const found = all.find(e => e.referenceName === referenceName)
  return found || None
}

export const samplerTypes = {
  find: referenceName => find(referenceName),
  all
}
