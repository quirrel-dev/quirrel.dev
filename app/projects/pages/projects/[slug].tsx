import { Suspense } from "react"
import { useParam, useQuery } from "blitz"
import getProject from "app/projects/queries/getProject"

function SpecificProject() {
  const slug = useParam("slug") as string

  const [project] = useQuery(getProject, slug)

  if (!project) {
    return <p>Not Found.</p>
  }

  return (
    <div>
      <h1>{project.slug}</h1>
    </div>
  )
}

export default function ProjectsSlug() {
  return (
    <Suspense fallback="Loading ...">
      <SpecificProject />
    </Suspense>
  )
}
