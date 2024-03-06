import NextAuth, { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import Auth0Provider from "next-auth/providers/auth0";
import { Provider } from "next-auth/providers/index";
import { DEBUG } from "~/lib/constants";

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
    refresh_token?: string;
    token_expires_at?: number;
  }
}

const audience = "guesstimate-api";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;

// Access tokens are issued for 86400 seconds, and next-auth refreshes sessions every 300 seconds.
// This should be somewhere in between these two values.
const refreshSecondsInAdvance = 3600;

function getAuthOptions(): AuthOptions {
  const providers: Provider[] = [];

  const refreshAccessToken = async (token: JWT): Promise<JWT> => {
    try {
      const response = await fetch(`${AUTH0_DOMAIN}/oauth/token`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
        body: new URLSearchParams({
          client_id: AUTH0_CLIENT_ID!,
          client_secret: AUTH0_CLIENT_SECRET!,
          grant_type: "refresh_token",
          refresh_token: token.refresh_token!,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh access_token");
      }

      const refreshedTokens: {
        access_token: string;
        expires_in: number;
      } = await response.json();

      return {
        ...token,
        access_token: refreshedTokens.access_token,
        expires_at: Date.now() / 1000 + refreshedTokens.expires_in,
      };
    } catch (error) {
      console.log(error);
      return token; // fail silently
    }
  };

  if (AUTH0_CLIENT_ID && AUTH0_CLIENT_SECRET && AUTH0_DOMAIN) {
    /**
     * Takes a token, and returns a new token with updated
     * `accessToken` and `accessTokenExpires`. If an error occurs,
     * returns the old token and an error property
     */
    const auth0Provider = Auth0Provider({
      clientId: AUTH0_CLIENT_ID,
      clientSecret: AUTH0_CLIENT_SECRET,
      issuer: AUTH0_DOMAIN,
    });
    (auth0Provider.authorization as any).params.audience = audience;
    (auth0Provider.authorization as any).params.scope =
      "openid email profile offline_access"; // offline_access is required for refresh tokens
    auth0Provider.token = {
      params: { audience },
    };
    providers.push(auth0Provider);
  }

  return {
    providers,
    debug: DEBUG,
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
        // Initial sign in
        if (account) {
          token.auth0_id = account.providerAccountId;
          token.access_token = account.access_token;
          // Note that this stored only in the encrypted part of our JWT.
          // We don't expose it in a session() callback.
          // So while we don't rotate refresh tokens, attack surface is limited.
          token.refresh_token = account.refresh_token;
          token.token_expires_at = account.expires_at;
          return token;
        }

        // Return previous token if the access token has not expired yet
        if (
          !token.token_expires_at ||
          Date.now() < (token.token_expires_at - refreshSecondsInAdvance) * 1000
        ) {
          return token;
        }

        return refreshAccessToken(token);
      },
    },
  };
}

export const authOptions = getAuthOptions();

export default NextAuth(authOptions);
