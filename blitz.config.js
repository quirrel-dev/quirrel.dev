const { sessionMiddleware, unstable_simpleRolesIsAuthorized } = require("@blitzjs/server")

module.exports = {
  middleware: [
    sessionMiddleware({
      unstable_isAuthorized: unstable_simpleRolesIsAuthorized,
    }),
  ],
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
        permanent: true
      }
    ]
  },
}
