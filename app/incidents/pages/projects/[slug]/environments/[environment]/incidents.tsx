import getIncidents from "app/incidents/queries/getIncidents"
import Layout from "app/layouts/Layout"
import { BlitzPage, Link, useParam, useQuery } from "blitz"

const IncidentsDashboard: BlitzPage = () => {
  const slug = useParam("slug", "string")!
  const environment = useParam("environment", "string")!

  const [incidents] = useQuery(getIncidents, {
    environmentName: environment,
    projectSlug: slug,
  })

  return (
    <div className="mt-4 max-w-screen-md lg:mx-auto">
      <span className="text-xl  text-gray-900 space-x-2 flex items-center">
        <Link href="/dashboard">
          <a>
            <h1 className="font-semibold hover:text-gray-700">Projects</h1>
          </a>
        </Link>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="inline w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>

        <Link href={`/projects/${slug}`}>
          <a>
            <h1 className="font-semibold hover:text-gray-700">{slug}</h1>
          </a>
        </Link>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="inline w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>

        <Link href={`/projects/${slug}/environments/${environment}`}>
          <a>
            <h1 className="font-semibold hover:text-gray-700">{environment}</h1>
          </a>
        </Link>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="inline w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>

        <span>Incidents</span>
      </span>

      <section>
        {incidents.length === 0 && (
          <div className="mt-4 rounded border-orange-300 border bg-orange-100 p-4 text-center max-w-lg m-auto">
            <p>This is the incident dashboard. At the moment, it's empty.</p>

            <p className="pt-4">
              Whenever your application fails at executing a job, it will appear here so you can
              remedy it.
            </p>
          </div>
        )}

        <ul>
          {incidents.map((incident) => (
            <li>{JSON.stringify(incident)}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}

IncidentsDashboard.getLayout = (page) => <Layout>{page}</Layout>

export default IncidentsDashboard
