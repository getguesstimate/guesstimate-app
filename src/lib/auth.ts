import { signIn as nextAuthSignIn } from "next-auth/react";

export async function signIn() {
  await nextAuthSignIn("auth0", {
    callbackUrl: "/auth-redirect",
  });
}

// Re-authenticate without showing Auth0's login screen. Used right after email
// verification: the Auth0 session is already alive, so `prompt=none` lets us
// silently get a fresh token (which re-runs account linking) with no extra
// click. The third arg is forwarded as authorization query params.
export async function signInSilently() {
  await nextAuthSignIn(
    "auth0",
    { callbackUrl: "/auth-redirect" },
    { prompt: "none" }
  );
}
