const developmentCreds = {
  CHARGEBEE_SITE: "guesstimate-test",
  CHARGEBEE_API_KEY: "test_8KGVtKWvLDecuvvBYmDr5HcdqyKEW4ymWe"
};

const productionCreds = {
  CHARGEBEE_SITE: 'guesstimate',
  CHARGEBEE_API_KEY: 'live_fy9YwQXXTM41U1lZssyvWXnJGaSx29bm'
};

export const variables = (__API_ENV__ === 'development') ? developmentCreds : productionCreds
