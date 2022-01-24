const { sessionMiddleware, simpleRolesIsAuthorized } = require("blitz")

const withSourceMaps = require("@zeit/next-source-maps")()

const {
  SENTRY_DSN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  NODE_ENV,
  HEROKU_SLUG_COMMIT,
  VERCEL_GITHUB_COMMIT_SHA,
} = process.env

const COMMIT_SHA = VERCEL_GITHUB_COMMIT_SHA || HEROKU_SLUG_COMMIT

const SentryWebpackPlugin = require("@sentry/webpack-plugin")

module.exports = withSourceMaps({
  env: {
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
  middleware: [
    sessionMiddleware({
      isAuthorized: simpleRolesIsAuthorized,
    }),
  ],
  images: {
    domains: ["pbs.twimg.com"],
  },
  async redirects() {
    return [
      {
        source: "/docs",
        destination: "https://docs.quirrel.dev",
        permanent: true,
      },
      {
        source: "/roadmap",
        destination: "https://github.com/orgs/quirrel-dev/projects/1",
        permanent: true,
      },
      {
        source: "/gh",
        destination: "https://github.com/quirrel-dev",
        permanent: true,
      },
      {
        source: "/github",
        destination: "https://github.com/quirrel-dev",
        permanent: true,
      },
    ]
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias["@sentry/node"] = "@sentry/browser"
    }

    if (
      SENTRY_DSN &&
      SENTRY_ORG &&
      SENTRY_PROJECT &&
      SENTRY_AUTH_TOKEN &&
      COMMIT_SHA &&
      NODE_ENV === "production"
    ) {
      config.plugins.push(
        new SentryWebpackPlugin({
          include: ".next",
          ignore: ["node_modules"],
          stripPrefix: ["webpack://_N_E/"],
          urlPrefix: `~/_next`,
          release: COMMIT_SHA,
        })
      )
    }

    return config
  },
})
