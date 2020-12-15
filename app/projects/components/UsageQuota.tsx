import { useQuery } from "blitz"
import getUsageQuota from "../queries/getUsageQuota"

export function UsageQuota() {
  const [usageQuota] = useQuery(getUsageQuota, undefined)

  const percentage = 100 * (usageQuota.used / usageQuota.quota)

  return (
    <span>
      <span className="font-medium text-gray-800">Usage since beginning of the Month: </span>
      {usageQuota.used} / {usageQuota.quota} API Calls ({percentage.toFixed(0)}%)
    </span>
  )
}
