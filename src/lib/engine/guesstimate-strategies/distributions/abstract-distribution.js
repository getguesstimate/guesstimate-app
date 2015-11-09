export default class AbstractDistribution {
  constructor(name, formatter, sampler) {
    this.name = name;
    this.formatter = formatter;
    this.sampler = sampler;
  }

  isA(g) { return this.formatter.isA(g) }
  errors(g, graph) { return this.formatter.errors(g, graph) || [] }
  hasErrors(g, graph) { return (this.errors(g, graph).length > 0) }

  sample(g, n, graph) {
    if (this.hasErrors(g, graph)) { return {errors: this.errors(g, graph)} }

    const formatted = this.formatter.format(g, graph)

    const errors = formatted.errors
    if (errors && (errors.length > 0)) { return {errors} }

    return this.sampler.sample(formatted, n, graph)
  }
  inputMetrics() { return [] }
}
