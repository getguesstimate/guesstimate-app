import chargebee from "chargebee";
import variables from "./constants";

chargebee.configure({
  site: variables.CHARGEBEE_SITE,
  api_key: variables.CHARGEBEE_API_KEY,
});
