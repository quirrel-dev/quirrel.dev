import basicAuth from "basic-auth"
import { BlitzApiRequest } from "blitz"

const passphrase = process.env.CRON_PASSPHRASE || process.env.COLLECT_USAGE_PASSPHRASE

export function isAuthenticated(req: BlitzApiRequest) {
  const result = basicAuth(req)
  if (!result) {
    return false
  }

  return result.pass === passphrase
}
