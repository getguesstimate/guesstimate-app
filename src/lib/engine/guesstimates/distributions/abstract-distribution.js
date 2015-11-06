export class AbstractDistribution {
  constructor(name, formatter, sampler) {
    this.name = name;
    this.formatter = formatter;
    this.sampler = sampler;
  }

  isA(g) { return this.formatter.isA(g) }
  isValid(g, graph) { return this.formatter.isValid(g, graph) }
  sample(g, graph) { return this.sampler.sample(g, graph) }
}
