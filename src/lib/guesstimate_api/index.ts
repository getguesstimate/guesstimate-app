import Models from "./resources/Models";
import Organizations from "./resources/Organizations";
import Users from "./resources/Users";
import { Calculators } from "./resources/Calculators";
import Accounts from "./resources/Accounts";
import Copies from "./resources/Copies";
import UserOrganizationMemberships from "./resources/UserOrganizationMemberships";
import { RootState } from "gModules/store";
import { rootUrl } from "servers/guesstimate-api/constants";

export default class GuesstimateApi {
  host: string;
  api_token?: string;
  models: Models;
  users: Users;
  calculators: Calculators;
  organizations: Organizations;
  copies: Copies;
  accounts: Accounts;
  userOrganizationMemberships: UserOrganizationMemberships;

  constructor({ host, api_token }: { host: string; api_token?: string }) {
    this.api_token = api_token;
    this.host = host;
    this.models = new Models(this);
    this.users = new Users(this);
    this.calculators = new Calculators(this);
    this.organizations = new Organizations(this);
    this.copies = new Copies(this);
    this.accounts = new Accounts(this);
    this.userOrganizationMemberships = new UserOrganizationMemberships(this);
  }
}

export const api = (state: RootState) => {
  return new GuesstimateApi({
    host: rootUrl,
    api_token: state.me.token,
  });
};
