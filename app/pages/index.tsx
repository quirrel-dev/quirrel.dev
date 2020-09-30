import { BlitzPage, Link, useSession } from "blitz"
import Layout from "app/layouts/Layout"
import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import js from "react-syntax-highlighter/dist/cjs/languages/hljs/javascript"
import { github } from "react-syntax-highlighter/dist/cjs/styles/hljs"

SyntaxHighlighter.registerLanguage("javascript", js)

function Hero() {
  const isSignedIn = !!useSession().userId
  return (
    <section className="mx-auto grid grid-cols-1 lg:grid-cols-2 row-gap-10 col-gap-10">
      <div className="mx-auto my-12">
        <div className="sm:text-center lg:text-left">
          <h2 className="tracking-tight font-extrabold text-gray-900 text-6xl leading-none">
            Job Queueing for
            <br />
            <span className="text-orange-600">Next.js x Vercel</span>
          </h2>
          <p className="text-gray-500 mt-5 text-xl">Quirrel makes job queues simple as cake.</p>
          <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
            <div className="rounded-md shadow">
              {isSignedIn ? (
                <Link href="/dashboard">
                  <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10">
                    Dashboard
                  </a>
                </Link>
              ) : (
                <a
                  href="https://docs.quirrel.dev"
                  target="blank"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-orange-600 hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:shadow-outline-indigo transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                </a>
              )}
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <a
                href="https://demo.quirrel.dev"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-orange-700 bg-orange-200 hover:text-orange-600 hover:bg-orange-50 focus:outline-none focus:shadow-outline-indigo focus:border-orange-300 transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
              >
                Try the Demo
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="m-auto inline-block">
        <SyntaxHighlighter
          language="javascript"
          style={github}
          className="rounded-lg border text-lg sm:text-xl border-gray-100"
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
    </section>
  )
}

interface AdvantagesProps {
  name: string
  title: string
  subtitle: string
  advantages: {
    title: string
    description: string
    svg: JSX.Element
    comingSoon?: boolean
  }[]
}

function Advantages(props: AdvantagesProps) {
  const { name, title, subtitle, advantages } = props
  return (
    <section id={name} className="py-12">
      <div className="lg:text-center">
        <p className="text-base leading-6 text-orange-600 font-semibold tracking-wide uppercase">
          {name}
        </p>
        <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
          {title}
        </h3>
        <p className="mt-4 max-w-2xl text-xl leading-7 text-gray-500 lg:mx-auto">{subtitle}</p>
      </div>

      <div className="mt-10">
        <ul className="md:grid md:grid-cols-2 col-gap-8 row-gap-10">
          {advantages.map((advantage, index) => {
            const { title, svg, description, comingSoon } = advantage

            return (
              <li key={index} className="mt-10 md:mt-0">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                      {svg}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span>
                      <h4 className="text-lg leading-6 inline font-medium text-gray-900">
                        {title}{" "}
                      </h4>
                      {comingSoon && (
                        <span className="bg-gray-300 text-xs p-1 rounded text-gray-600 ml-2">
                          Coming Soon
                        </span>
                      )}
                    </span>

                    <p className="mt-2 text-base leading-6 text-gray-500">{description}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Features() {
  return (
    <Advantages
      name="features"
      title="Jobs for every occasion."
      subtitle="Whatever job you need, Quirrel supports it."
      advantages={[
        {
          title: "Delayed Jobs",
          description:
            "Want to send a message to your customer, one week after they signed up? Use a delayed job.",
          svg: (
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
          ),
        },
        {
          title: "Fanout Jobs",
          description:
            "Sometimes, you just need to offload some computation onto a diferent lambda. That's what fanout jobs are there for.",
          svg: (
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
          ),
        },
        {
          title: "Recurring Jobs",
          description: `
          Have a task that needs to be executed multiple times, e.g. reminding your users of something?
          Recurring tasks make that easy to implement.`,
          comingSoon: true,
          svg: (
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
          ),
        },
        {
          title: "Cron Jobs",
          description:
            "Good old Cron Jobs, coming to Quirrel. Use for once-a-month invoicing, fetching data on a schedule, or analytics to run hourly.",
          svg: <span className="text-lg">0 * *</span>,
          comingSoon: true,
        },
      ]}
    />
  )
}

function Perks() {
  return (
    <Advantages
      name="perks"
      title="The best solution available."
      subtitle="Deeply integrated and a joy to use."
      advantages={[
        {
          title: "Great DX",
          description:
            "First-class support selected frameworks. Use the development UI (coming soon) to inspect pending jobs during development.",
          svg: (
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
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          ),
        },
        {
          title: "Set up in 5 minutes",
          description:
            "Setting up is as easy as pasting a client secret into the environment variables.",
          svg: (
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
        },
        {
          title: "Open Source",
          description:
            "Licensed under MIT. Extend, modify, fix, fork - do (almost) anything you want.",
          svg: <span className="text-lg">MIT</span>,
        },
        {
          title: "On Premises",
          description: "For projects that require on-prem hosting, self-hosting is easy as cake.",
          svg: (
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
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
              />
            </svg>
          ),
        },
      ]}
    />
  )
}

const ossDiscountMail = {
  to: "info@quirrel.dev",
  subject: "OSS / Side Project Discount",
  body: `
Hi there!

I'd like to apply for Quirrel's OSS / Side Project discount.

Here's a link to my project: [Link]
This is what I want to use Quirrel for: [...]
I expect to make [...] monhtly Quirrel calls.

Looking forward to you reply!

Best,
...
  `.trim(),
}

const ossDiscountMailTo = `mailto:${ossDiscountMail.to}?subject=${encodeURIComponent(
  ossDiscountMail.subject
)}&body=${encodeURIComponent(ossDiscountMail.body)}`

function Pricing() {
  return (
    <section id="pricing" className="py-12 lg:w-3/4 mx-auto">
      <div className="lg:text-center">
        <p className="text-base leading-6 text-orange-600 font-semibold tracking-wide uppercase">
          Pricing
        </p>
        <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
          Start{" "}
          <span className="bg-clip-text text-transparent rounded bg-gradient-to-r from-orange-300 to-red-400">
            free
          </span>
          , grow with us.
        </h3>
        <p className="mt-4 max-w-2xl text-xl leading-7 text-gray-500 lg:mx-auto">
          Two easy-to-understand plans. Because we're not a cloud provider.
        </p>

        <div className="mx-auto max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-2 pt-8 text-left h-76">
          <div className="col-span-1">
            <div className="p-8 bg-gray-300 rounded-t-lg" style={{ height: "12rem" }}>
              <h3 className="text-lg font-semibold rounded-full bg-orange-200 inline-block px-2 text-orange-500">
                Free
              </h3>

              <br />

              <h1 className="mt-2 text-4xl text-gray-900 font-extrabold mx-auto inline-block">
                $0<span className="text-gray-600 text-2xl font-medium">, forever.</span>
              </h1>

              <p className="text-gray-600 mt-2">Try and evaluate Quirrel, as long as you want.</p>
            </div>
            <div className="px-8 py-4 bg-gray-200 rounded-b-lg" style={{ height: "8rem" }}>
              <ul>
                <li className="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="inline w-8 h-8 text-orange-500 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  100 calls / month.
                </li>
              </ul>

              <Link href="/signup">
                <a className="block mt-4 text-center text-orange-600 px-8 py-3 text-base font-medium rounded-md bg-white hover:bg-orange-100 transition duration-150 ease-in-out">
                  Sign Up
                </a>
              </Link>
            </div>
          </div>
          <div className="col-span-1">
            <div className="p-8 bg-gray-300 rounded-t-lg" style={{ height: "12rem" }}>
              <h3 className="text-lg font-semibold rounded-full bg-orange-200 inline-block px-2 text-orange-500">
                Paid
              </h3>

              <br />

              <h1 className="mt-2 text-4xl text-gray-900 font-extrabold mx-auto inline-block">
                $TBA<span className="text-gray-600 text-2xl font-medium"> per 1000 calls.</span>
              </h1>

              <p className="text-gray-600 mt-2">Ready for production.</p>
            </div>
            <div className="px-8 py-4 bg-gray-200 rounded-b-lg" style={{ height: "8rem" }}>
              <ul>
                <li className="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="inline w-8 h-8 text-orange-500 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  billed monthly
                </li>
                <li className="flex items-center text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="inline w-8 h-8 text-orange-500 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  credit card / PayPal
                </li>
              </ul>
            </div>
          </div>

          <section
            id="cta"
            className="col-span-1 md:col-span-2 rounded-lg py-4 px-6 text-md justify-between flex items-center bg-gray-300 text-gray-700"
          >
            <span>OSS & Side Projects are discounted up to 100%.</span>
            <a
              href={ossDiscountMailTo}
              className="text-orange-700 text-base hover:text-orange-500 transition duration-150 ease-in-out"
            >
              Get in Contact
            </a>
          </section>
        </div>
      </div>
    </section>
  )
}

function CTA() {
  const isSignedIn = !!useSession().userId
  return (
    <section
      id="cta"
      className="rounded-lg bg-orange-600 text-white py-4 px-6 text-xl justify-between flex items-center max-w-4xl mx-auto"
    >
      <span>Built for developers. Get started with Quirrel in 5 minutes.</span>

      {isSignedIn ? (
        <Link href="/dashboard">
          <a className="text-center text-orange-600 px-8 py-3 text-base font-medium rounded-md bg-white hover:bg-orange-100 transition duration-150 ease-in-out">
            Dashboard
          </a>
        </Link>
      ) : (
        <Link href="/signup">
          <a className="text-center text-orange-600 px-8 py-3 text-base font-medium rounded-md bg-white hover:bg-orange-100 transition duration-150 ease-in-out">
            Sign Up
          </a>
        </Link>
      )}
    </section>
  )
}

function About() {
  return (
    <section id="about" className="py-12 mx-auto">
      <div className="lg:text-center">
        <p className="text-base leading-6 text-orange-600 font-semibold tracking-wide uppercase">
          About
        </p>
        <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
          The pleasant-to-use, open-source job queueing solution.
        </h3>
        <p className="mt-4 max-w-xl text-xl leading-7 text-gray-500 lg:mx-auto">
          The idea to Quirrel came during a holiday in Greece, where Simon started thinking about
          the easiest way to integrate a Job Queue into Next.js applications.
        </p>
      </div>

      <div className="mt-8 flex flex-row justify-center">
        <img
          className="rounded h-48"
          src="https://pbs.twimg.com/profile_images/1308267953515880453/k54az9-2_400x400.jpg"
          alt="Person"
        />
        <div className="ml-4">
          <span>
            <h4 className="text-lg leading-6 font-medium text-gray-900">Simon Knott</h4>

            <h5 className="text-md leading-6 font-medium text-gray-700">Creator of Quirrel</h5>
          </span>

          <p className="mt-2 text-base leading-6 text-gray-600">
            Hi, I'm Simon! I love music, working on developer tooling and giving talks.
            <br />
            You may know me from the Blitz.js ecosystem or SuperJSON. Say <code>Hi</code> on
            Twitter! :D
          </p>

          <div className="mt-4 flex items-center space-x-3">
            <a
              href="https://twitter.com/skn0tt"
              target="blank"
              className="text-gray-600 transition-colors duration-300 hover:text-gray-400"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5">
                <path d="M24,4.6c-0.9,0.4-1.8,0.7-2.8,0.8c1-0.6,1.8-1.6,2.2-2.7c-1,0.6-2,1-3.1,1.2c-0.9-1-2.2-1.6-3.6-1.6 c-2.7,0-4.9,2.2-4.9,4.9c0,0.4,0,0.8,0.1,1.1C7.7,8.1,4.1,6.1,1.7,3.1C1.2,3.9,1,4.7,1,5.6c0,1.7,0.9,3.2,2.2,4.1 C2.4,9.7,1.6,9.5,1,9.1c0,0,0,0,0,0.1c0,2.4,1.7,4.4,3.9,4.8c-0.4,0.1-0.8,0.2-1.3,0.2c-0.3,0-0.6,0-0.9-0.1c0.6,2,2.4,3.4,4.6,3.4 c-1.7,1.3-3.8,2.1-6.1,2.1c-0.4,0-0.8,0-1.2-0.1c2.2,1.4,4.8,2.2,7.5,2.2c9.1,0,14-7.5,14-14c0-0.2,0-0.4,0-0.6 C22.5,6.4,23.3,5.5,24,4.6z" />
              </svg>
            </a>
            <a
              href="https://simonknott.de"
              target="blank"
              className="text-gray-600 transition-colors duration-300 hover:text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

const Home: BlitzPage = () => {
  return (
    <div className="max-w-screen-xl mx-auto overflow-hidden space-y-12">
      <Hero />
      <Features />
      <Perks />
      <Pricing />
      <About />
      <CTA />
    </div>
  )
}

Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
