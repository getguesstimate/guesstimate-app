import { signIn as nextAuthSignIn } from "next-auth/react";

export async function signIn() {
  await nextAuthSignIn("auth0", {
    callbackUrl: "/auth-redirect",
  });
}
