import { withSentryConfig } from "@sentry/nextjs";

/**
 * @type {import('next').NextConfig}
 */
let config = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  config = withSentryConfig(
    onfig,
    {
      // For all available options, see:
      // https://www.npmjs.com/package/@sentry/webpack-plugin
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      // This is necessary for uploadin source maps.  Technically, Sentry should
      // grab this from env itself, and maybe it does, but I had trouble with
      // this for `dsn` in `sentry.*.config.ts`, so it's better to be explicit.
      authToken: process.env.SENTRY_AUTH_TOKEN,
    },
    {
      // For all available options, see:
      // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

      // Upload a larger set of source maps for prettier stack traces (increases build time)
      widenClientFileUpload: true,

      // Transpiles SDK to be compatible with IE11 (increases bundle size)
      transpileClientSDK: true,

      // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
      tunnelRoute: "/monitoring",

      // Hides source maps from generated client bundles
      hideSourceMaps: true,

      // Automatically tree-shake Sentry logger statements to reduce bundle size
      disableLogger: true,

      // Enables automatic instrumentation of Vercel Cron Monitors.
      // See the following for more information:
      // https://docs.sentry.io/product/crons/
      // https://vercel.com/docs/cron-jobs
      automaticVercelMonitors: true,
    }
  );
}

export default config;
