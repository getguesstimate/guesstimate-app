import { authOptions } from "~/pages/api/auth/[...nextauth]";

jest.mock("next-auth", () => ({ __esModule: true, default: jest.fn() }));

const originalFetch = global.fetch;
afterEach(() => {
  global.fetch = originalFetch;
  jest.useRealTimers();
  jest.restoreAllMocks();
});

it.each([undefined, "rotated-refresh-token"])(
  "keeps a refreshed session usable and preserves or rotates its refresh token (%s)",
  async (refreshToken) => {
    const now = 1800000000000;
    jest.useFakeTimers().setSystemTime(now);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "renewed-access-token",
        expires_in: 86400,
        refresh_token: refreshToken,
      }),
    });
    const token = await authOptions.callbacks!.jwt!({
      token: {
        auth0_id: "test-user",
        access_token: "expired-access-token",
        token_expires_at: 1,
        refresh_token: "original-refresh-token",
      },
    } as any);
    expect(token.token_expires_at).toBe(now / 1000 + 86400);
    expect(token.refresh_token).toBe(refreshToken ?? "original-refresh-token");
    const session = await authOptions.callbacks!.session!({
      session: { expires: "2099-01-01T00:00:00Z" },
      token,
    } as any);
    expect(session).toMatchObject({
      auth0_id: "test-user",
      access_token: "renewed-access-token",
    });
  }
);
