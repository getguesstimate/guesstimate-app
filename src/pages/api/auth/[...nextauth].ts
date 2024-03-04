import NextAuth, { AuthOptions } from "next-auth";
import Auth0Provider from "next-auth/providers/auth0";
import { Provider } from "next-auth/providers/index";

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

const audience = "guesstimate-api";

export const variables = {};

function getAuthOptions(): AuthOptions {
  const providers: Provider[] = [];

  const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
  const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
  const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

  if (AUTH0_CLIENT_ID && AUTH0_CLIENT_SECRET && AUTH0_DOMAIN) {
    const auth0Provider = Auth0Provider({
      clientId: AUTH0_CLIENT_ID,
      clientSecret: AUTH0_CLIENT_SECRET,
      issuer: AUTH0_DOMAIN,
    });
    (auth0Provider.authorization as any).params.audience = audience;
    auth0Provider.token = {
      params: { audience },
    };
    providers.push(auth0Provider);
  }

  return {
    providers,
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
