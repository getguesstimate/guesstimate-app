import { signIn as nextAuthSignIn } from "next-auth/react";

export function signIn() {
  nextAuthSignIn("auth0", {
    callbackUrl: "/auth-redirect",
  });
}
