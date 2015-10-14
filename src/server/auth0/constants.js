const developmentCreds = {
  AUTH0_CLIENT_ID: 'By2xEUCPuGqeJZqAFMpBlgHRqpCZelj0',
  AUTH0_DOMAIN: 'guesstimate.auth0.com'
};

const productionCreds = {
  AUTH0_CLIENT_ID: '1kdjZNIalU4m0AO2Uqn9JsNyf7l3AzQT',
  AUTH0_DOMAIN: 'guesstimate.auth0.com'
};

export const variables = (__API_ENV__ === 'development') ? developmentCreds : productionCreds
