export const Sample = (n, sampler, inputs) => {
    let results = []
    while (results.length < n) {
      results.push(sampler.apply(this, inputs))
    }
    return results
}
