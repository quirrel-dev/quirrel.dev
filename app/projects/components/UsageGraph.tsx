import { useQuery } from "blitz"
import getUsageRecords from "../queries/getUsageRecords"

import {
  VictoryChart,
  VictoryZoomContainer,
  VictoryLine,
  VictoryAxis,
  VictoryLabel,
  VictoryTheme,
} from "victory"

interface UsageGraphProps {
  projectSlug?: string
  tokenName?: string
}

export function UsageGraph(props: UsageGraphProps) {
  const { projectSlug, tokenName } = props

  const [usage] = useQuery(getUsageRecords, { tokenName, projectSlug })

  return (
    <VictoryChart
      height={300}
      width={600}
      scale={{ x: "time" }}
      containerComponent={<VictoryZoomContainer zoomDimension="x" />}
      theme={VictoryTheme.material}
    >
      <VictoryAxis dependentAxis />
      <VictoryLabel x={25} y={24} text="API Calls" />
      <VictoryAxis />
      <VictoryLine
        style={{
          data: { stroke: "tomato" },
        }}
        data={usage}
        x="timestamp"
        y="invocations"
      />
    </VictoryChart>
  )
}
