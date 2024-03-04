import NextAuth, { AuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { __API_ENV__ } from "~/lib/constants";

declare module "next-auth" {
  interface Session {
    auth0_id?: string;
    access_token?: string;
    token_expires_at?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    auth0_id?: string;
    access_token?: string;
    token_expires_at?: number;
  }
}

// TODO - these should be in env files
const developmentCreds = {
  AUTH0_CLIENT_ID: "9UwzFayrqvJerFA3BQQKYluCRJ5ani0g",
  AUTH0_DOMAIN: "https://guesstimate-development.auth0.com",
};

const productionCreds = {
  AUTH0_CLIENT_ID: "d3v3ZWblDkYTAYaYsGPQidFA0eEOwCEm",
  AUTH0_DOMAIN: "https://guesstimate.auth0.com",
};

const audience = "guesstimate-api";

export const variables =
  __API_ENV__ === "development" ? developmentCreds : productionCreds;

function getAuthOptions(): AuthOptions {
  const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

  if (!AUTH0_CLIENT_SECRET) {
    throw new Error("AUTH0_CLIENT_SECRET must be configured");
  }

  const auth0Provider = Auth0Provider({
    clientId: variables.AUTH0_CLIENT_ID,
    clientSecret: AUTH0_CLIENT_SECRET,
    issuer: variables.AUTH0_DOMAIN,
  });
  (auth0Provider.authorization as any).params.audience = audience;
  auth0Provider.token = {
    params: { audience },
  };

  return {
    providers: [auth0Provider],
    debug: true,
    callbacks: {
      async session({ session, token }) {
        // TODO - support refresh tokens
        if (
          token.access_token &&
          token.token_expires_at &&
          token.token_expires_at > new Date().getTime() / 1000
        ) {
          session.auth0_id = token.auth0_id;
          session.access_token = token.access_token;
          session.token_expires_at = token.token_expires_at;
        }
        return session;
      },
      async jwt({ token, account }) {
        if (account) {
          token.auth0_id = account.providerAccountId;
          token.access_token = account.access_token;
          token.token_expires_at = account.expires_at;
        }
        return token;
      },
    },
  };
}

export const authOptions = getAuthOptions();

export default NextAuth(authOptions);
