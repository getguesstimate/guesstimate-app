const Auth0Variables = {
  AUTH0_CLIENT_ID: "By2xEUCPuGqeJZqAFMpBlgHRqpCZelj0",
  AUTH0_DOMAIN: "guesstimate.auth0.com",
};

const lock = new Auth0Lock(
  Auth0Variables.AUTH0_CLIENT_ID,
  Auth0Variables.AUTH0_DOMAIN
);
