import { Suspense } from "react"
import { useParam, useQuery } from "blitz"
import getProject from "app/projects/queries/getProject"
import addToken from "app/projects/mutations/addToken"
import deleteToken from "app/projects/mutations/deleteToken"

function SpecificProject() {
  const slug = useParam("slug") as string

  const [project, projectMeta] = useQuery(getProject, { slug })

  if (!project) {
    return <p>Not Found.</p>
  }

  return (
    <div>
      <h1>{project.slug}</h1>
      <h2>Tokens</h2>
      <ul>
        {project.tokens.map((token) => (
          <li>
            <span>{token.name}</span>

            <button
              onClick={async () => {
                const sure = window.confirm("You sure?")
                if (sure) {
                  await deleteToken({ projectSlug: slug, name: token.name })
                  await projectMeta.refetch()
                }
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={async () => {
          const name = window.prompt("Name?")
          if (!name) {
            return
          }

          const token = await addToken({ projectSlug: slug, name })
          await projectMeta.refetch()
          window.alert(token)
        }}
      >
        Add Token
      </button>
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
