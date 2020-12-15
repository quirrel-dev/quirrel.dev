import { TimeSeriesRow } from "../queries/getUsageRecords"

export function addZeroRecords(
  records: TimeSeriesRow[],
  desiredSpacing = 60 * 60 * 1000,
  threshold = 1.2
): TimeSeriesRow[] {
  const result = [...records]

  for (let i = 0; i < result.length - 1; i++) {
    const current = result[i]
    const next = result[i + 1]

    const spacing = +next.timestamp - +current.timestamp
    if (spacing > desiredSpacing * threshold) {
      result.splice(i + 1, 0, {
        timestamp: new Date(+current.timestamp + desiredSpacing),
        invocations: 0,
      })
    }
  }

  return result
}
