const { sessionMiddleware, unstable_simpleRolesIsAuthorized } = require("@blitzjs/server")

module.exports = {
  middleware: [
    sessionMiddleware({
      unstable_isAuthorized: unstable_simpleRolesIsAuthorized,
    }),
  ],
  images: {
    domains: ["pbs.twimg.com"],
  },
  async redirects() {
    return [
      {
        source: "/pricing",
        destination: "/#pricing",
        permanent: true,
      },
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
}
