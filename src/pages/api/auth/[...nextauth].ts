import NextAuth, { AuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { __API_ENV__ } from "~/lib/constants";

declare module "next-auth" {
  interface Session {
    auth0_id?: string;
    auth0_id_token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    auth0_id?: string;
    auth0_id_token?: string;
  }
}

const developmentCreds = {
  AUTH0_CLIENT_ID: "hNPSROXtn9Ohg4Pa9ijLxAbvbIEJjFJN",
  AUTH0_DOMAIN: "https://guesstimate-development.auth0.com",
};

const productionCreds = {
  AUTH0_CLIENT_ID: "1kdjZNIalU4m0AO2Uqn9JsNyf7l3AzQT",
  AUTH0_DOMAIN: "https://guesstimate.auth0.com",
};

export const variables =
  __API_ENV__ === "development" ? developmentCreds : productionCreds;

function getAuthOptions(): AuthOptions {
  const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

  if (!AUTH0_CLIENT_SECRET) {
    throw new Error("AUTH0_CLIENT_SECRET must be configured");
  }

  return {
    providers: [
      Auth0Provider({
        clientId: variables.AUTH0_CLIENT_ID,
        clientSecret: AUTH0_CLIENT_SECRET,
        issuer: variables.AUTH0_DOMAIN,
      }),
    ],
    debug: true,
    callbacks: {
      async session({ session, token }) {
        session.auth0_id = token.auth0_id;
        session.auth0_id_token = token.auth0_id_token;
        return session;
      },
      async jwt({ token, account }) {
        if (account) {
          token.auth0_id = account.providerAccountId;
          // TODO: should use access token instead
          token.auth0_id_token = account.id_token;
        }
        return token;
      },
    },
  };
}

export const authOptions = getAuthOptions();

export default NextAuth(authOptions);
