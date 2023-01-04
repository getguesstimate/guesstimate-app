import { __API_ENV__ } from "~/lib/constants";

const developmentCreds = {
  AUTH0_CLIENT_ID: "X0m2PZEyAOqhtLY1Qz9mdetHzQcDsG8U",
  AUTH0_DOMAIN: "guesstimate-development.auth0.com",
};

const productionCreds = {
  AUTH0_CLIENT_ID: "1kdjZNIalU4m0AO2Uqn9JsNyf7l3AzQT",
  AUTH0_DOMAIN: "guesstimate.auth0.com",
};

export const tokenLifetimeMs = 10 * 60 * 60 * 1000;

export const variables =
  __API_ENV__ === "development" ? developmentCreds : productionCreds;
