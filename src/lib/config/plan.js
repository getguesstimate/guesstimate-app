import planYaml from 'json!yaml!./plans.yml'

export default class Plan {
  static asHashes() {
    return planYaml.plans
  }

  static all() {
    const that = this
    return this.asHashes().map(e => new that(e))
  }

  static find(id) {
    return this.all().filter(e => (e.id === id))[0]
  }

  constructor({id, monthly_cost, name, private_model_limit}) {
    this.id = id;
    this.monthlyCost = monthly_cost;
    this.name = name;
    this.privateModelLimit = private_model_limit
  }

  fullName() {
    return `${this.name} Plan`
  }

  number() {
    return (this.id === 'personal_infinite') ? `∞` : this.privateModelLimit
  }
}
