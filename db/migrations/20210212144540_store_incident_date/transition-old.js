const { PrismaClient } = require("@prisma/client")

const db = new PrismaClient()

async function main() {
  const incidents = await db.incident.findMany()
  console.log("Starting to process ", incidents.length, " incidents")
  for (const incident of incidents) {
    const { runAt } = JSON.parse(incident.jobData)
    await db.incident.update({
      data: {
        date: runAt
      },
      where: {
        id: incident.id
      }
    })
    console.log("Processed ", incident.id)
  }
  console.log("Done")
}

main().then(() => db.$disconnect())