import { BlitzApiRequest, BlitzApiResponse } from "blitz"
import * as z from "zod"
import db from "db"
import { parseToken } from "app/projects/tokens-repo"
import { sendEmailWithTemplate } from "app/postmark"

const passphrase = process.env.INCIDENT_RECEIVER_PASSPHRASE
const bearerHeader = `Bearer ${passphrase}`

function isAuthenticated(req: BlitzApiRequest) {
  return req.headers.authorization === bearerHeader
}

const incidentPayload = z.object({
  type: z.literal("incident"),
  job: z.object({
    tokenId: z.string(),
    id: z.string(),
    endpoint: z.string(),
    payload: z.string(),
    runAt: z.string(),
  }),
  incident: z.object({
    status: z.number().default(-1),
    body: z.any(),
  }),
})

function ellipsize(value: string, limit = 100) {
  if (value.length < limit) {
    return value
  }

  return value.substring(0, limit) + "..."
}

export default async function incidentReceiver(req: BlitzApiRequest, res: BlitzApiResponse) {
  if (!isAuthenticated(req)) {
    return res.status(401).end()
  }

  const { incident, job } = incidentPayload.parse(req.body)
  const token = parseToken(job.tokenId)

  const owner = await db.user.findUnique({ where: { id: token.ownerId } })
  if (!owner || !owner.isActive) {
    throw new Error("Owner should exist!")
  }

  await db.incident.create({
    data: {
      token: {
        connect: {
          projectSlug_projectOwnerId_name: {
            name: token.name,
            projectOwnerId: token.ownerId,
            projectSlug: token.projectSlug,
          },
        },
      },
      incident: JSON.stringify(incident),
      jobData: JSON.stringify(job),
      date: job.runAt,
    },
  })

  await sendEmailWithTemplate(owner.email, "incident-caught", {
    projectId: token.projectSlug,
    tokenId: token.name,
    endpoint: job.endpoint,
    jobId: job.id,
    incidentHttpStatus: "" + incident.status,
    incident: ellipsize(JSON.stringify(incident.body ?? "n/a")),
  })

  return res.status(200).end()
}
