const developmentCreds = {
  CHARGEBEE_SITE: 'X0m2PZEyAOqhtLY1Qz9mdetHzQcDsG8U',
  CHARGEBEE_API_KEY: 'guesstimate-development.auth0.com'
};

const productionCreds = {
  CHARGEBEE_SITE: 'X0m2PZEyAOqhtLY1Qz9mdetHzQcDsG8U',
  CHARGEBEE_API_KEY: 'guesstimate-development.auth0.com'
};

export const variables = (__API_ENV__ === 'development') ? developmentCreds : productionCreds
