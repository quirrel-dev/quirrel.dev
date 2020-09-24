import { ReactNode, Suspense, useState } from "react"
import { Head, Link } from "blitz"
import { LoginState } from "app/components/LoginState"
import { Transition } from "@tailwindui/react"
import subscribeToNewsletter from "app/users/mutations/subscribeToNewsletter"

export interface LayoutProps {
  title?: string
  children: ReactNode
  hideLogin?: boolean
}

const Layout = ({ title, children, hideLogin }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <div className="mx-auto xl:mt-6">
      <Head>
        <title>{title || "Quirrel"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative py-6 px-4 sm:px-6 lg:px-8">
        <nav className="relative flex items-center justify-between sm:h-10 lg:justify-start">
          <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
            <div className="flex items-center justify-between w-full lg:w-auto">
              <Link href="/">
                <img
                  aria-label="Home"
                  className="h-8 w-auto sm:h-10 ml-1"
                  src="https://tailwindui.com/img/logos/workflow-mark-on-white.svg"
                  alt="Logo"
                />
              </Link>
              {!hideLogin && (
                <div className="-mr-2 flex items-center lg:hidden">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                    id="main-menu"
                    aria-label="Main menu"
                    aria-haspopup="true"
                    onClick={() => {
                      setMobileMenuOpen((v) => !v)
                    }}
                  >
                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="hidden lg:block md:ml-10 md:pr-4 w-full">
            <Link href="/#features">
              <a className="font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out">
                Features
              </a>
            </Link>
            <Link href="/#pricing">
              <a className="ml-8 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out">
                Pricing
              </a>
            </Link>
            <a
              href="https://docs.quirrel.dev"
              target="blank"
              className="ml-8 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out"
            >
              Documentation
            </a>
            <Link href="/#about">
              <a className="ml-8 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out">
                About
              </a>
            </Link>

            {!hideLogin && (
              <Suspense fallback={null}>
                <LoginState>
                  {({ onClick, isLoggedIn }) =>
                    isLoggedIn ? (
                      <span className="float-right">
                        <Link href="/dashboard">
                          <a className="ml-8 font-medium text-gray-600 hover:text-gray-500 transition duration-150 ease-in-out">
                            Dashboard
                          </a>
                        </Link>
                        <a
                          className="ml-8 font-medium text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out"
                          role="menuitem"
                          tabIndex={-1}
                          onClick={onClick}
                          onKeyDown={onClick}
                        >
                          Log Out
                        </a>
                      </span>
                    ) : (
                      <Link href="/login">
                        <a className="ml-8 font-medium text-indigo-600 hover:text-indigo-900 transition duration-150 ease-in-out float-right">
                          Log in
                        </a>
                      </Link>
                    )
                  }
                </LoginState>
              </Suspense>
            )}
          </div>
        </nav>
      </div>

      <Transition
        show={mobileMenuOpen}
        enter="duration-150 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right lg:hidden z-10">
          <div className="rounded-lg shadow-md">
            <div
              className="rounded-lg bg-white shadow-xs overflow-hidden"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="main-menu"
            >
              <div className="px-5 pt-4 flex items-center justify-between">
                <div>
                  <img
                    className="h-8 w-auto sm:h-10"
                    src="https://tailwindui.com/img/logos/workflow-mark-on-white.svg"
                    alt=""
                  />
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                    aria-label="Close menu"
                    onClick={() => setMobileMenuOpen((v) => !v)}
                  >
                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="px-2 py-3">
                <Link href="/#features">
                  <a
                    className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                    role="menuitem"
                  >
                    Features
                  </a>
                </Link>

                <Link href="/#pricing">
                  <a
                    className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                    role="menuitem"
                  >
                    Pricing
                  </a>
                </Link>

                <a
                  href="https://docs.quirrel.dev"
                  target="blank"
                  className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                  role="menuitem"
                >
                  Documentation
                </a>

                <Link href="/#about">
                  <a
                    className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                    role="menuitem"
                  >
                    About
                  </a>
                </Link>

                {!hideLogin && (
                  <Suspense fallback={null}>
                    <LoginState>
                      {({ onClick, isLoggedIn }) =>
                        isLoggedIn ? (
                          <span className="flex">
                            <Link href="/dashboard">
                              <a className="block w-full px-5 py-3 text-center font-medium bg-gray-50 hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:bg-gray-100 focus:text-indigo-700 transition duration-150 ease-in-out">
                                Dashboard
                              </a>
                            </Link>
                            <a
                              className="block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:bg-gray-100 focus:text-indigo-700 transition duration-150 ease-in-out"
                              role="menuitem"
                              tabIndex={-1}
                              onClick={() => {
                                onClick()
                                setMobileMenuOpen(false)
                              }}
                              onKeyDown={() => {
                                onClick()
                                setMobileMenuOpen(false)
                              }}
                            >
                              Log Out
                            </a>
                          </span>
                        ) : (
                          <div>
                            <a
                              href="#"
                              className="block w-full px-5 py-3 text-center font-medium text-indigo-600 bg-gray-50 hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:bg-gray-100 focus:text-indigo-700 transition duration-150 ease-in-out"
                              role="menuitem"
                              onClick={() => {
                                onClick()
                                setMobileMenuOpen(false)
                              }}
                            >
                              {isLoggedIn ? "Log Out" : "Log In"}
                            </a>
                          </div>
                        )
                      }
                    </LoginState>
                  </Suspense>
                )}
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <main className="my-8 mx-8" style={{ minHeight: "50vh" }}>
        <section
          id="cta"
          className="text-center rounded-lg bg-indigo-600 mb-12 text-white py-4 px-6 text-xl max-w-2xl mx-auto"
        >
          <span>
            Quirrel is currently in active development and not yet meant for production usage. Feel
            free to{" "}
            <a
              className="text-yellow-400 hover:text-gray-100 transition-colors duration-200"
              href="mailto:info@simonknott.de"
            >
              reach out
            </a>{" "}
            for questions :)
          </span>
        </section>
        {children}
      </main>

      <footer className="px-8 w-full py-8 bg-gray-100">
        <div className="mx-auto max-w-screen-xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-10 gap-10 lg:gap-20 mb-3">
          <div className="col-span-3">
            <Link href="/">
              <a>
                <img
                  aria-label="Home"
                  className="h-8 w-auto sm:h-10 ml-1 inline-block"
                  src="https://tailwindui.com/img/logos/workflow-mark-on-white.svg"
                  alt="Logo"
                />
                <span className="ml-2 text-xl font-semibold">Quirrel</span>
              </a>
            </Link>
            <p className="text-md my-4 text-gray-500">
              Job Queueing for Next.js x Vercel.
              <br />
              <br />
              Simon Knott
              <br />
              Stahnsdorfer Straße 142b
              <br />
              14482 Potsdam
              <br />
              Germany
              <br />
            </p>
          </div>
          <nav className="col-span-1 md:col-span-1 lg:col-span-2">
            <p className="uppercase text-gray-600 text-xs tracking-wider font-medium mb-3">
              Product
            </p>
            <Link href="/#features">
              <a className="flex mb-3 md:mb-2 text-sm font-medium text-gray-800 hover:text-primary transition-colors duration-100 ease-in">
                Features
              </a>
            </Link>

            <LoginState>
              {({ isLoggedIn }) =>
                isLoggedIn ? (
                  <Link href="/dashboard">
                    <a className="flex mb-3 md:mb-2 text-sm font-medium text-gray-800 hover:text-primary transition-colors duration-100 ease-in">
                      Dashboard
                    </a>
                  </Link>
                ) : (
                  <Link href="/Sign Up">
                    <a className="flex mb-3 md:mb-2 text-sm font-medium text-gray-800 hover:text-primary transition-colors duration-100 ease-in">
                      Sign Up
                    </a>
                  </Link>
                )
              }
            </LoginState>

            <a
              href="https://github.com/orgs/quirrel-dev/projects/1"
              target="blank"
              className="flex mb-3 md:mb-2 text-sm font-medium text-gray-800 hover:text-primary transition-colors duration-100 ease-in"
            >
              Roadmap
            </a>

            <a
              href="https://docs.quirrel.dev"
              target="blank"
              className="flex mb-3 md:mb-2 text-sm font-medium text-gray-800 hover:text-primary transition-colors duration-100 ease-in"
            >
              Documentation
            </a>
            <Link href="/#pricing">
              <a className="flex mb-3 md:mb-2 text-sm font-medium text-gray-800 hover:text-primary transition-colors duration-100 ease-in">
                Pricing
              </a>
            </Link>
          </nav>

          <nav className="col-span-2 md:col-span-1 lg:col-span-2">
            <p className="uppercase text-gray-600 text-xs tracking-wider font-medium mb-3">
              Contact
            </p>
            <a
              href="https://dev.to/quirrel"
              target="blank"
              className="flex mb-3 md:mb-2 text-sm font-medium text-gray-800 hover:text-primary transition-colors duration-100 ease-in"
            >
              Blog
            </a>
            <a
              href="https://twitter.com/skn0tt"
              target="blank"
              className="flex mb-3 md:mb-2 text-sm font-medium text-gray-800 hover:text-primary transition-colors duration-100 ease-in"
            >
              Twitter
            </a>
            <a
              href="mailto:info@quirrel.dev"
              target="blank"
              className="flex mb-3 md:mb-2 text-sm font-medium text-gray-800 hover:text-primary transition-colors duration-100 ease-in"
            >
              Email
            </a>
          </nav>
          <div className="col-span-3">
            <p className="uppercase text-gray-600 text-xs tracking-wider font-medium mb-3">
              SUBSCRIBE TO OUR NEWSLETTER
            </p>
            <form
              className="mb-2"
              onSubmit={async (evt) => {
                evt.preventDefault()

                const target = evt.target as HTMLFormElement

                const form = new FormData(target)
                const email = form.get("email") as string

                await subscribeToNewsletter({ email })

                target.reset()

                window.alert("Awesome! You'll receive a confirmation e-mail shortly.")
              }}
            >
              <label className="tag-label tag-label-sm">
                <div className="tag-append">
                  <input
                    name="email"
                    className="inline-block placeholder-gray-500 appearance-none px-3 py-2 text-gray-900 rounded-l-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                  <button
                    className="text-center px-4 py-1 border border-transparent text-base leading-6 font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition duration-150 ease-in-out"
                    type="submit"
                  >
                    Subscribe
                  </button>
                </div>
              </label>
            </form>
            <p className="text-xs text-gray-600">
              Stay up-to-date on Quirrel development and get exclusive insights.
            </p>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-t border-gray-200 pt-10 mt-10">
          <p className="text-gray-700 font-medium text-sm text-left mb-6 md:mb-0">
            © Copyright 2020 Simon Knott. All Rights Reserved.
          </p>
          <div className="flex items-start md:items-center justify-start md:justify-center space-x-6">
            <Link href="/terms">
              <a className="font-medium text-sm text-gray-700 hover:text-primary transition-colors duration-100 ease-in">
                Terms
              </a>
            </Link>
            <Link href="/privacy">
              <a className="font-medium text-sm text-gray-700 hover:text-primary transition-colors duration-100 ease-in">
                Privacy
              </a>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
