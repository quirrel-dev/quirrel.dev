import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import collectUsage from "./collectUsage"

export default async function registerCron(req: BlitzApiRequest, res: BlitzApiResponse) {
  await collectUsage.enqueue(null, {
    id: "collectUsage",
    override: true,
    repeat: {
      cron: "@hourly",
    },
  })

  /*
  await issueInvoices.enqueue(null, {
    id: "issueInvoices",
    override: true,
    repeat: {
      cron: // at month's end
    },
  })
  */

  res.status(200).end()
}
