import { SessionContext } from "blitz"

interface TimeSeriesRow {
  date: string
  invocations: number
}

export default async function getUsageRecords(
  { tokenName }: { projectSlug: string; tokenName?: string },
  ctx: { session?: SessionContext } = {}
) {
  ctx.session?.authorize()

  const data: TimeSeriesRow[] = []
  for (let i = 1; i < 8; i += 1) {
    const digits = ((i % 12) + 1).toString().padStart(2, "0")
    data.push({
      date: `2020-05-${digits}T00:00:00`,
      invocations: i * (!!tokenName ? 111111 : 888888),
    })
  }

  return data
}
