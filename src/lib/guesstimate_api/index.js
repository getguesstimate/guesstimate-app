import Models from "./resources/Models";
import Organizations from "./resources/Organizations";
import Users from "./resources/Users";
import { Calculators } from "./resources/Calculators";
import Accounts from "./resources/Accounts";
import Copies from "./resources/Copies";
import UserOrganizationMemberships from "./resources/UserOrganizationMemberships";

export default class GuesstimateApi {
  constructor(params) {
    this.api_token = params["api_token"];
    this.host = params["host"];
    this.models = new Models(this);
    this.users = new Users(this);
    this.calculators = new Calculators(this);
    this.organizations = new Organizations(this);
    this.copies = new Copies(this);
    this.accounts = new Accounts(this);
    this.userOrganizationMemberships = new UserOrganizationMemberships(this);
  }
}
