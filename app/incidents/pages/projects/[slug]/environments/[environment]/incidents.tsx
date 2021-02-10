import deleteIncidentMutation from "app/incidents/mutations/deleteIncident"
import getIncidents from "app/incidents/queries/getIncidents"
import Layout from "app/layouts/Layout"
import {
  BlitzPage,
  Link,
  useMutation,
  useParam,
  useQuery,
  invalidateQuery,
  PromiseReturnType,
} from "blitz"
import { useCallback, useState } from "react"
import Encryptor from "secure-e2ee"

function keyBy<T>(arr: T[], keyer: (v: T) => string): Record<string, T> {
  const result: Record<string, T> = {}

  for (const item of arr) {
    result[keyer(item)] = item
  }

  return result
}

interface DecryptButtonProps {
  onDecrypt(secret: string): void
}

function DecryptButton(props: DecryptButtonProps) {
  return (
    <button
      className="relative w-40 py-2 px-3 border border-transparent rounded-md text-white font-semibold bg-gray-500 hover:bg-gray-600 focus:bg-gray-800 focus:outline-none focus:shadow-outline sm:text-sm sm:leading-5"
      onClick={() => {
        const secret = window.prompt(
          "Decryption will happen fully client-sided, your secret won't leave the browser.",
          "Please put in your encryption secret."
        )

        if (!secret) {
          return
        }

        if (secret.length !== 32) {
          window.alert("Secret needs to be of length 32.")
          return
        }

        props.onDecrypt(secret)
      }}
    >
      <span className="absolute left-0 inset-y pl-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-5 w-5 text-gray-700"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
          />
        </svg>
      </span>
      Decrypt
    </button>
  )
}

type DecryptedIncident = PromiseReturnType<typeof getIncidents>[0] & { decryptedPayload?: string }

interface IncidentTableProps {
  incidents: DecryptedIncident[]
}

function IncidentTable(props: IncidentTableProps) {
  const { incidents } = props
  const [deleteIncident] = useMutation(deleteIncidentMutation)

  return (
    <ul className="space-y-2">
      {incidents.map((row) => {
        return (
          <li className="rounded-md p-4 bg-gray-200" key={row.id}>
            <button
              className="float-right"
              onClick={async () => {
                const sure = window.confirm(
                  "Are you sure? You won't be able to recover the incident data."
                )

                if (sure) {
                  await deleteIncident({ id: row.id })
                  invalidateQuery(getIncidents)
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-5 w-5 text-gray-700 hover:text-red-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <strong>Endpoint:</strong> {row.jobData.endpoint} <br />
            <strong>Date:</strong> {row.jobData.runAt.toLocaleString()} <br />
            <strong>Payload:</strong>{" "}
            {row.decryptedPayload ?? <span title="Use the decrypt-button to read.">******</span>}{" "}
            <br />
            <strong>Error:</strong> <br />
            <code className="break-all">{JSON.stringify(row.incident.body)}</code>
          </li>
        )
      })}
    </ul>
  )
}

const IncidentsDashboard: BlitzPage = () => {
  const slug = useParam("slug", "string")!
  const environment = useParam("environment", "string")!

  const [encryptedIncidents] = useQuery(getIncidents, {
    environmentName: environment,
    projectSlug: slug,
  })

  const [incidents, setDecryptedIncidents] = useState<Record<string, DecryptedIncident>>(
    keyBy(encryptedIncidents, (i) => i.id)
  )

  const decrypt = useCallback(
    async (decryptionSecret: string) => {
      const encryptor = new Encryptor(decryptionSecret)

      const decryptedPayloads: Record<string, string> = {}

      let someCouldNotBeDecryptedBecauseOfMissingAuthTag = false
      let someCouldNotBeDecryptedBecauseOfWrongSecret = false

      await Promise.all(
        encryptedIncidents.map(async (incident) => {
          try {
            const decryptedPayload = await encryptor.decrypt(incident.jobData.payload)

            decryptedPayloads[incident.id] = decryptedPayload
          } catch (error) {
            if (error.message === "Could not decrypt: Auth tag missing.") {
              someCouldNotBeDecryptedBecauseOfMissingAuthTag = true
            }

            if (error.message === "Could not decrypt: No matching secret.") {
              someCouldNotBeDecryptedBecauseOfWrongSecret = true
            }
          }
        })
      )

      if (someCouldNotBeDecryptedBecauseOfMissingAuthTag) {
        window.alert(
          "Some of your jobs were encrypted using an old version of Quirrel that wasn't yet compatible with client-side decryption. If you need to access that payload, check out the secure-e2ee package or reach out to @skn0tt for further assistance."
        )
      }

      const noneCouldBeDecrypted = Object.keys(decryptedPayloads).length === 0

      if (noneCouldBeDecrypted) {
        window.alert("Seems like this isn't the right secret. Maybe try another one?")
      } else if (someCouldNotBeDecryptedBecauseOfWrongSecret) {
        window.alert(
          "Some of your jobs were encrypted using another secret. Repeat this process for your other encryption secrets."
        )
      }

      setDecryptedIncidents((oldIncidents) => {
        const newIncidents = { ...oldIncidents }

        for (const [id, decryptedPayload] of Object.entries(decryptedPayloads)) {
          newIncidents[id] = {
            ...newIncidents[id],
            decryptedPayload,
          }
        }

        return newIncidents
      })
    },
    [encryptedIncidents]
  )

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
        {encryptedIncidents.length === 0 && (
          <div className="mt-4 rounded border-orange-300 border bg-orange-100 p-4 text-center max-w-lg m-auto">
            <p>This is the incident dashboard. At the moment, it's empty.</p>

            <p className="pt-4">
              Whenever your application fails at executing a job, it will appear here so you can
              remedy it.
            </p>
          </div>
        )}

        <span className="flex justify-between items-center my-4">
          <span>{/* Placeholder for Flex */}</span>

          <span>
            <a
              download="incidents.json"
              href={
                "data:application/json;base64," + btoa(JSON.stringify(Object.values(incidents)))
              }
              className="px-8 font-semibold text-gray-500 hover:text-gray-700 transition ease-in-out duration-150 cursor-pointer"
            >
              Download as JSON
            </a>
            <DecryptButton onDecrypt={decrypt} />
          </span>
        </span>

        <IncidentTable incidents={Object.values(incidents)} />
      </section>
    </div>
  )
}

IncidentsDashboard.getLayout = (page) => <Layout>{page}</Layout>

export default IncidentsDashboard
