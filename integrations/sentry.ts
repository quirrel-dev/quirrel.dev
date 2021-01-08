import * as Sentry from "@sentry/node"
import getConfig from "next/config"
import { RewriteFrames } from "@sentry/integrations"

if (process.env.SENTRY_DSN) {
  const config = getConfig()
  const distDir = `${config.serverRuntimeConfig.rootDir}/.next`
  Sentry.init({
    integrations: [
      new RewriteFrames({
        iteratee: (frame: any) => {
          frame.filename = frame.filename.replace(distDir, "app:///_next")
          return frame
        },
      }),
    ],
    dsn: process.env.SENTRY_DSN,
    beforeSend(event, hint) {
      const error = hint?.originalException
      if (error && typeof error !== "string") {
        switch (error.name) {
          case "AuthenticationError":
          case "AuthorizationError":
          case "NotFoundError":
          case "ChunkLoadError":
            return null
        }
      }
      return event
    },
  })
}

export default Sentry
