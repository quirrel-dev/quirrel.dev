import { PromiseReturnType } from "@prisma/client"
import getIncidents from "app/incidents/queries/getIncidents"
import Layout from "app/layouts/Layout"
import { BlitzPage, Link, useParam, useQuery } from "blitz"
import { useCallback, useState } from "react"
import { BrowserEncryptor } from "secure-e2ee"

interface DecryptButtonProps {
  onDecrypt(secret: string): void
  isEncrypted: boolean
}

function DecryptButton(props: DecryptButtonProps) {
  if (!props.isEncrypted) {
    return (
      <button
        disabled
        className="w-40 py-2 px-3 border border-transparent rounded-md text-white font-semibold bg-green-500 sm:text-sm sm:leading-5 cursor-not-allowed"
      >
        Decrypted
      </button>
    )
  }

  return (
    <button
      className="relative w-40 py-2 px-3 border border-transparent rounded-md text-white font-semibold bg-gray-500 hover:bg-gray-600 focus:bg-gray-800 focus:outline-none focus:shadow-outline sm:text-sm sm:leading-5"
      onClick={() => {
        window.alert(
          "This isn't working yet. If you need to decrypt your incidents _now_, contact Simon and he'll help you."
        )

        /*
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
        */
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

interface IncidentTableProps {
  incidents: PromiseReturnType<typeof getIncidents>
  isEncrypted: boolean
}

function IncidentTable(props: IncidentTableProps) {
  const { incidents } = props

  return (
    <ul className="space-y-2">
      {incidents.map((row) => {
        return (
          <li className="rounded-md p-4 bg-gray-200" key={row.id}>
            <strong>Endpoint:</strong> {row.jobData.endpoint} <br />
            <strong>Date:</strong> {row.jobData.runAt.toLocaleString()} <br />
            <strong>Payload:</strong>{" "}
            {props.isEncrypted ? (
              <span title="Use the decrypt-button to read.">******</span>
            ) : (
              row.jobData.endpoint
            )}{" "}
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

  const [incidents] = useQuery(getIncidents, {
    environmentName: environment,
    projectSlug: slug,
  })

  const [decryptedIncidents, setDecryptedIncidents] = useState<typeof incidents | undefined>()

  const incidentsToUse = decryptedIncidents ?? incidents

  const decrypt = useCallback(
    async (decryptionSecret: string) => {
      const encryptor = new BrowserEncryptor(decryptionSecret)

      const decrypted = await Promise.all(
        incidents.map(async (incident) => {
          const decryptedPayload = await encryptor.decrypt(incident.jobData.payload)
          return {
            ...incident,
            jobData: {
              ...incident.jobData,
              payload: decryptedPayload,
            },
          }
        })
      )

      setDecryptedIncidents(decrypted)
    },
    [incidents]
  )

  const isEncrypted = !decryptedIncidents

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

        <span className="flex justify-between items-center my-4">
          <span>{/* Placeholder for Flex */}</span>

          <span>
            <a
              download="incidents.json"
              href={"data:application/json;base64," + btoa(JSON.stringify(incidentsToUse))}
              className="px-8 font-semibold text-gray-500 hover:text-gray-700 transition ease-in-out duration-150 cursor-pointer"
            >
              Download as JSON
            </a>
            <DecryptButton onDecrypt={decrypt} isEncrypted={isEncrypted} />
          </span>
        </span>

        <IncidentTable incidents={incidentsToUse} isEncrypted={isEncrypted} />
      </section>
    </div>
  )
}

IncidentsDashboard.getLayout = (page) => <Layout>{page}</Layout>

export default IncidentsDashboard
