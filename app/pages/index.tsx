import { Link, BlitzPage, useQuery } from "blitz"
import Layout from "app/layouts/Layout"
import logout from "app/auth/mutations/logout"
import { useCurrentUser } from "app/hooks/useCurrentUser"
import { Suspense } from "react"
import createProject from "app/mutations/createProject"
import getProjectSlugs from "app/queries/getProjectSlugs"

const UserInfo = () => {
  const currentUser = useCurrentUser()

  if (currentUser) {
    return (
      <>
        <button
          className="button small"
          onClick={async () => {
            await logout()
          }}
        >
          Logout
        </button>
        <div>
          User id: <code>{currentUser.id}</code>
        </div>
      </>
    )
  } else {
    return (
      <>
        <Link href="/signup">
          <a className="button small">
            <strong>Sign Up</strong>
          </a>
        </Link>
        <Link href="/login">
          <a className="button small">
            <strong>Login</strong>
          </a>
        </Link>
      </>
    )
  }
}

function Projects() {
  const [projectSlugs, projectSlugsMeta] = useQuery(getProjectSlugs, {})

  return (
    <div>
      <h1>Projects</h1>

      <ul>
        {projectSlugs.map((slug) => (
          <li>
            <Link href={`/projects/${slug}`}>{slug}</Link>
          </li>
        ))}
      </ul>
      <button
        onClick={async () => {
          const slug = window.prompt("Enter Slug for new project", "my-project")
          if (!slug) {
            return
          }

          await createProject(slug)
          await projectSlugsMeta.refetch()
        }}
      >
        Add new project
      </button>
    </div>
  )
}

const Home: BlitzPage = () => {
  return (
    <div className="container">
      <main>
        <div className="buttons" style={{ marginTop: "1rem", marginBottom: "5rem" }}>
          <Suspense fallback="Loading...">
            <UserInfo />
          </Suspense>
        </div>

        <Suspense fallback="Loading ...">
          <Projects />
        </Suspense>
      </main>
    </div>
  )
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
