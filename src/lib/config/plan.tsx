import numeral from "numeral";

// converted from yaml for typescript compatibility and type safety
type PlanShape = {
  name: string;
  id: string;
  enum_id: number;
  monthly_cost: number;
  private_model_limit: number;
};

const planYaml: PlanShape[] = [
  {
    name: "Free",
    id: "personal_free",
    enum_id: 1,
    monthly_cost: 0,
    private_model_limit: 0,
  },
  {
    name: "Lite",
    id: "personal_lite",
    enum_id: 2,
    monthly_cost: 500,
    private_model_limit: 20,
  },
  {
    name: "Premium",
    id: "personal_premium",
    enum_id: 3,
    monthly_cost: 1200,
    private_model_limit: 100,
  },
  {
    name: "Infinite",
    id: "personal_infinite",
    enum_id: 4,
    monthly_cost: 0,
    private_model_limit: 1000,
  },
  {
    name: "Organization Free",
    id: "organization_free",
    enum_id: 5,
    monthly_cost: 0,
    private_model_limit: 0,
  },
  {
    name: "Organization Premium",
    id: "organization_basic_30",
    enum_id: 6,
    monthly_cost: 1200,
    private_model_limit: 200,
  },
];

export default class Plan {
  id: string;
  name: string;
  monthlyCost: number;
  privateModelLimit: number;

  static asHashes() {
    return planYaml;
  }

  static all() {
    const that = this;
    return this.asHashes().map((e) => new that(e));
  }

  static find(id) {
    return this.all().filter((e) => e.id === id)[0];
  }

  constructor({ id, monthly_cost, name, private_model_limit }) {
    this.id = id;
    this.monthlyCost = monthly_cost;
    this.name = name;
    this.privateModelLimit = private_model_limit;
  }

  fullName() {
    return `${this.name} Plan`;
  }

  number() {
    return this.id === "personal_infinite" ? `∞` : this.privateModelLimit;
  }

  formattedCost() {
    return numeral(this.monthlyCost / 100).format("0,0");
  }
}
