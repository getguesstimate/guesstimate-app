import { sampler as dataSampler } from "./samplers/Data";
import { sampler as distributionBetaSampler } from "./samplers/DistributionBeta";
import { sampler as distributionLognormalSampler } from "./samplers/DistributionLognormal";
import { sampler as distributionNormalSampler } from "./samplers/DistributionNormal";
import { sampler as distributionPointSampler } from "./samplers/DistributionPoint";
import { sampler as distributionUniformSampler } from "./samplers/DistributionUniform";
import { sampler as functionSampler } from "./samplers/Function";
import { sampler as noneSampler } from "./samplers/None";
import { Sampler } from "./samplers/Simulator";

const FunctionIcon = "/assets/distribution-icons/function.png";
const LogNormalIcon = "/assets/distribution-icons/lognormal.png";
const NormalIcon = "/assets/distribution-icons/normal.png";
const PointIcon = "/assets/distribution-icons/point.png";
const UniformIcon = "/assets/distribution-icons/uniform.png";

type SamplerType = {
  referenceName: string;
  types: string[];
  displayName: string;
  sampler: Sampler; // FIXME
  isRangeDistribution?: boolean;
  icon?: string;
};

export const Funct: SamplerType = {
  referenceName: "FUNCTION",
  types: ["FUNCTION"],
  displayName: "Function",
  sampler: functionSampler,
  icon: FunctionIcon,
};

export const DistributionNormal: SamplerType = {
  referenceName: "NORMAL",
  types: ["DISTRIBUTION", "NORMAL"],
  displayName: "Normal",
  sampler: distributionNormalSampler,
  isRangeDistribution: true,
  icon: NormalIcon,
};

export const DistributionPoint: SamplerType = {
  referenceName: "POINT",
  types: ["DISTRIBUTION", "POINT"],
  displayName: "Point",
  sampler: distributionPointSampler,
  icon: PointIcon,
};

export const DistributionLognormal: SamplerType = {
  referenceName: "LOGNORMAL",
  types: ["DISTRIBUTION", "LOGNORMAL"],
  displayName: "LogNormal",
  isRangeDistribution: true,
  sampler: distributionLognormalSampler,
  icon: LogNormalIcon,
};

export const DistributionBeta: SamplerType = {
  referenceName: "BETA",
  types: ["DISTRIBUTION", "BETA"],
  displayName: "Beta",
  isRangeDistribution: false,
  sampler: distributionBetaSampler,
  icon: LogNormalIcon, // Update
};

export const DistributionUniform: SamplerType = {
  referenceName: "UNIFORM",
  types: ["DISTRIBUTION", "UNIFORM"],
  displayName: "Uniform",
  isRangeDistribution: true,
  sampler: distributionUniformSampler,
  icon: UniformIcon,
};

export const Data: SamplerType = {
  referenceName: "DATA",
  types: ["DATA"],
  displayName: "Data",
  isRangeDistribution: false,
  sampler: dataSampler,
  icon: UniformIcon,
};

// Change to null Guesstimate for sampler
export const None: SamplerType = {
  referenceName: "NONE",
  types: [],
  displayName: "NONE",
  sampler: noneSampler,
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

function find(referenceName: string) {
  const found = all.find((e) => e.referenceName === referenceName);
  return found || None;
}

export const samplerTypes = {
  find: (referenceName: string) => find(referenceName),
  all,
};
