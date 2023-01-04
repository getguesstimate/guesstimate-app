import { __API_ENV__ } from "~/lib/constants";
import GuesstimateApi from "../../lib/guesstimate_api/index";

export const rootUrl =
  __API_ENV__ === "development"
    ? "http://localhost:4000/"
    : "https://guesstimate.herokuapp.com/";

export function setupGuesstimateApi(api_token: string | undefined) {
  return new GuesstimateApi({ host: rootUrl, api_token });
}
