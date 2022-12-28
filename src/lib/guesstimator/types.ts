import { Sampler as DataSampler } from "./samplers/Data";
import { Sampler as DistributionBetaSampler } from "./samplers/DistributionBeta";
import { Sampler as DistributionLognormalSampler } from "./samplers/DistributionLognormal";
import { Sampler as DistributionNormalSampler } from "./samplers/DistributionNormal";
import { Sampler as DistributionPointSampler } from "./samplers/DistributionPoint";
import { Sampler as DistributionUniformSampler } from "./samplers/DistributionUniform";
import { Sampler as FunctionSampler } from "./samplers/Function";
import { Sampler as NoneSampler } from "./samplers/None";

const FunctionIcon = "/assets/distribution-icons/function.png";
const LogNormalIcon = "../assets/distribution-icons/lognormal.png";
const NormalIcon = "../assets/distribution-icons/normal.png";
const PointIcon = "../assets/distribution-icons/point.png";
const UniformIcon = "../assets/distribution-icons/uniform.png";

type SamplerType = {
  referenceName: string;
  types: string[];
  displayName: string;
  sampler: any; // FIXME
  isRangeDistribution?: boolean;
  icon?: string;
};

export const Funct: SamplerType = {
  referenceName: "FUNCTION",
  types: ["FUNCTION"],
  displayName: "Function",
  sampler: FunctionSampler,
  icon: FunctionIcon,
};

export const DistributionNormal: SamplerType = {
  referenceName: "NORMAL",
  types: ["DISTRIBUTION", "NORMAL"],
  displayName: "Normal",
  sampler: DistributionNormalSampler,
  isRangeDistribution: true,
  icon: NormalIcon,
};

export const DistributionPoint: SamplerType = {
  referenceName: "POINT",
  types: ["DISTRIBUTION", "POINT"],
  displayName: "Point",
  sampler: DistributionPointSampler,
  icon: PointIcon,
};

export const DistributionLognormal: SamplerType = {
  referenceName: "LOGNORMAL",
  types: ["DISTRIBUTION", "LOGNORMAL"],
  displayName: "LogNormal",
  isRangeDistribution: true,
  sampler: DistributionLognormalSampler,
  icon: LogNormalIcon,
};

export const DistributionBeta: SamplerType = {
  referenceName: "BETA",
  types: ["DISTRIBUTION", "BETA"],
  displayName: "Beta",
  isRangeDistribution: false,
  sampler: DistributionBetaSampler,
  icon: LogNormalIcon, // Update
};

export const DistributionUniform: SamplerType = {
  referenceName: "UNIFORM",
  types: ["DISTRIBUTION", "UNIFORM"],
  displayName: "Uniform",
  isRangeDistribution: true,
  sampler: DistributionUniformSampler,
  icon: UniformIcon,
};

export const Data: SamplerType = {
  referenceName: "DATA",
  types: ["DATA"],
  displayName: "Data",
  isRangeDistribution: false,
  sampler: DataSampler,
  icon: UniformIcon,
};

// Change to null Guesstimate for sampler
export const None: SamplerType = {
  referenceName: "NONE",
  types: [],
  displayName: "NONE",
  sampler: NoneSampler,
};

const all: SamplerType[] = [
  Funct,
  DistributionNormal,
  DistributionBeta,
  DistributionPoint,
  DistributionLognormal,
  DistributionUniform,
  Data,
  None,
];

export function find(referenceName: string) {
  const found = all.find((e) => e.referenceName === referenceName);
  return found || None;
}

export const samplerTypes = {
  find: (referenceName: string) => find(referenceName),
  all,
};
