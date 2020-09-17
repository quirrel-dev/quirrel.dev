import { BlitzPage, Link, useSession } from "blitz"
import Layout from "app/layouts/Layout"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import js from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript"
import { github } from "react-syntax-highlighter/dist/cjs/styles/hljs"

SyntaxHighlighter.registerLanguage("javascript", js)

const Home: BlitzPage = () => {
  const isSignedIn = !!useSession().userId
  return (
    <div className="max-w-screen-xl mx-auto bg-white overflow-hidden space-y-12 px-8">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 row-gap-10 col-gap-10">
        <main className="mx-auto my-24">
          <div className="sm:text-center lg:text-left">
            <h2 className="tracking-tight leading-10 font-extrabold text-gray-900 text-6xl leading-none">
              Job Queueing for
              <br />
              <span className="text-indigo-600">Next.js x Vercel</span>
            </h2>
            <p className="text-base text-gray-500 mt-5 text-xl">
              Quirrel makes job queues simple as cake.
            </p>
            <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <div className="rounded-md shadow">
                {isSignedIn ? (
                  <Link href="/dashboard">
                    <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
                      Dashboard
                    </a>
                  </Link>
                ) : (
                  <Link href="/signup">
                    <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
                      Sign Up
                    </a>
                  </Link>
                )}
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <a
                  href="https://demo.quirrel.dev"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-300 transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                >
                  Try the Demo
                </a>
              </div>
            </div>
          </div>
        </main>

        <div className="m-auto inline-block">
          <SyntaxHighlighter
            language="javascript"
            style={github}
            className="rounded-lg border text-xl"
            showLineNumbers
            lineNumberStyle={{
              color: "lightgray",
            }}
            customStyle={{
              padding: "0.5em",
              width: "20em",
            }}
          >
            {`
export default Queue(
  "queues/email",
  async (job) => {
    await smtp.dispatch(
      job.recipient,
      job.subject,
      job.name
    )
  }
)
`.trim()}
          </SyntaxHighlighter>
        </div>
      </div>

      <section id="features" className="py-12">
        <div className="lg:text-center">
          <p className="text-base leading-6 text-indigo-600 font-semibold tracking-wide uppercase">
            Features
          </p>
          <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
            Jobs for every occasion.
          </h3>
          <p className="mt-4 max-w-2xl text-xl leading-7 text-gray-500 lg:mx-auto">
            Whatever job you need, Quirrel supports it.
          </p>
        </div>

        <div className="mt-10">
          <ul className="md:grid md:grid-cols-2 md:col-gap-8 md:row-gap-10">
            <li>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg leading-6 font-medium text-gray-900">Delayed Jobs</h4>
                  <p className="mt-2 text-base leading-6 text-gray-500">
                    Want to send a message to your customer, one week after they signed up? Use a
                    delayed job.
                  </p>
                </div>
              </div>
            </li>
            <li className="mt-10 md:mt-0">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <span className="text-lg">0 * *</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg leading-6 font-medium text-gray-900">Cron Jobs</h4>
                  <p className="mt-2 text-base leading-6 text-gray-500">
                    Need to Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores
                    impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.
                  </p>
                </div>
              </div>
            </li>
            <li className="mt-10 md:mt-0">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg leading-6 font-medium text-gray-900">Recurring Jobs</h4>
                  <p className="mt-2 text-base leading-6 text-gray-500">
                    Have a recurring task that needs to be setup programmatically? "Remind " Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis
                    suscipit eaque, iste dolor cupiditate blanditiis ratione.
                  </p>
                </div>
              </div>
            </li>
            <li className="mt-10 md:mt-0">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg leading-6 font-medium text-gray-900">Fanout Jobs</h4>
                  <p className="mt-2 text-base leading-6 text-gray-500">
                    Sometimes, you just need to offload some computation onto a diferent lambda.
                    That's what fanout jobs are there for.
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section id="perks" className="py-12">
        <div className="lg:text-center">
          <p className="text-base leading-6 text-indigo-600 font-semibold tracking-wide uppercase">
            Perks
          </p>
          <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
            The best solution available.
          </h3>
          <p className="mt-4 max-w-2xl text-xl leading-7 text-gray-500 lg:mx-auto">
            Whatever job you need, Quirrel supports it.
          </p>
        </div>

        <div className="mt-10">
          <ul className="md:grid md:grid-cols-2 md:col-gap-8 md:row-gap-10">
            <li>
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg leading-6 font-medium text-gray-900">Delayed Jobs</h4>
                  <p className="mt-2 text-base leading-6 text-gray-500">
                    Want to send a message to your customer, one week after they signed up? Use a
                    delayed job.
                  </p>
                </div>
              </div>
            </li>
            <li className="mt-10 md:mt-0">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <span className="text-lg">0 * *</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg leading-6 font-medium text-gray-900">Cron Jobs</h4>
                  <p className="mt-2 text-base leading-6 text-gray-500">
                    Need to Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores
                    impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.
                  </p>
                </div>
              </div>
            </li>
            <li className="mt-10 md:mt-0">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg leading-6 font-medium text-gray-900">Recurring Jobs</h4>
                  <p className="mt-2 text-base leading-6 text-gray-500">
                    Have a recurring task that needs to be setup programmatically? "Remind " Lorem
                    ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis
                    suscipit eaque, iste dolor cupiditate blanditiis ratione.
                  </p>
                </div>
              </div>
            </li>
            <li className="mt-10 md:mt-0">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 5l7 7-7 7M5 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg leading-6 font-medium text-gray-900">Fanout Jobs</h4>
                  <p className="mt-2 text-base leading-6 text-gray-500">
                    Sometimes, you just need to offload some computation onto a diferent lambda.
                    That's what fanout jobs are there for.
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section id="pricing" className="py-12 lg:w-1/2 mx-auto">
        <div className="lg:text-center">
          <p className="text-base leading-6 text-indigo-600 font-semibold tracking-wide uppercase">
            Pricing
          </p>
          <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
            Simple, pay-as-you-go pricing.
          </h3>
          <p className="mt-4 max-w-2xl text-xl leading-7 text-gray-500 lg:mx-auto">
            Easy to understand. Because we're not a cloud provider.
          </p>

          <h1 className="mt-8 text-5xl text-gray-900 font-extrabold mx-auto inline-block">
            $TBA<span className="text-gray-600 text-2xl font-medium"> per 1000 invocations.</span>
          </h1>
        </div>
      </section>

      <section
        id="cta"
        className="rounded-lg bg-indigo-600 text-white py-4 px-6 text-xl justify-between flex items-center max-w-4xl mx-auto"
      >
        <span>Built for developers. Get started with Quirrel in 5 minutes.</span>

        {isSignedIn ? (
          <Link href="/dashboard">
            <a className="items-center text-indigo-600 justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-white hover:bg-indigo-100 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
              Dashboard
            </a>
          </Link>
        ) : (
          <Link href="/signup">
            <a className="items-center text-indigo-600 justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-white hover:bg-indigo-100 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
              Sign Up
            </a>
          </Link>
        )}
      </section>
    </div>
  )
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
