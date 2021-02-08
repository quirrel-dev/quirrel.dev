import getIncidents from "app/incidents/queries/getIncidents"
import { useQuery, QueryFn, FirstParam, PromiseReturnType } from "blitz"
import { Suspense } from "react"

interface QueryProps<Q extends QueryFn> {
  query: Q
  param: FirstParam<Q>
  children(data: PromiseReturnType<Q>): React.ReactElement
}

export function Query<Q extends QueryFn>(props: QueryProps<Q>) {
  const [data] = useQuery(props.query, props.param)
  return props.children(data)
}

function UsageExample() {
  return (
    <section>
      <h1>Incidents</h1>
      <Suspense fallback="Loading...">
        <Query
          query={getIncidents}
          param={{ environmentName: "someEnvironment", projectSlug: "someProject" }}
        >
          {(incidents) => (
            <ul>
              {incidents.map((incident) => (
                <li>{incident.incident}</li>
              ))}
            </ul>
          )}
        </Query>
      </Suspense>
    </section>
  )
}
