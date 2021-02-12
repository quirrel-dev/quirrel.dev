import { useQuery, QueryFn, FirstParam, PromiseReturnType } from "blitz"

interface QueryProps<Q extends QueryFn> {
  query: Q
  param: FirstParam<Q>
  children(data: PromiseReturnType<Q>): React.ReactElement
}

export function Query<Q extends QueryFn>(props: QueryProps<Q>) {
  const [data] = useQuery(props.query, props.param)
  return props.children(data)
}
