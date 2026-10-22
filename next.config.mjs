import { withSentryConfig } from "@sentry/nextjs";
import {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} from "next/constants.js";
import {
  buildPublicPages,
  publicPageRewrites,
} from "./scripts/build-public-pages.mjs";

/**
 * @type {import('next').NextConfig}
 */
let config = {
  async rewrites() {
    return {
      // Public information pages do not need the application or its session.
      beforeFiles: publicPageRewrites(),
      // Local HTTPS previews are not included in the production API's CORS origins.
      afterFiles:
        process.env.GUESSTIMATE_PREVIEW_API_PROXY === "true"
          ? [
              {
                source: "/api/guesstimate/:path*",
                destination: "https://api.getguesstimate.com/:path*",
              },
            ]
          : [],
    };
  },
};

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  config = withSentryConfig(
    config,
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

export default (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER || phase === PHASE_PRODUCTION_BUILD) {
    buildPublicPages();
  }
  return config;
};
