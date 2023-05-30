import { ReactNode, Suspense, useState } from "react"
import { Head, Link, Image } from "blitz"
import { LoginState } from "app/components/LoginState"
import { Transition } from "@tailwindui/react"

export interface LayoutProps {
  title?: string
  children: ReactNode
  hideLogin?: boolean
}

const Layout = ({ title, children, hideLogin }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <div
        className="relative overflow-hidden flex justify-center text-white text-sm font-semibold py-2 px-4 sm:px-6 lg:px-8 bg-center bg-no-repeat"
        style={{
          backgroundColor: "#2250F4",
        }}
      >
        <div className="relative flex items-center flex-wrap">
          <div className="flex items-center">
            <img
              src="https://www.netlify.com/v3/img/components/logomark-dark.svg"
              className="h-5 w-5 mr-2 text-blue-300"
              alt="netlify logo"
            />
            Quirrel joins Netlify.
            <a href="https://dev.to/quirrel/quirrel-is-acquired-and-i-am-joining-netlify-dha" target="_blank" className="ml-1 underline">
              Learn more
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-4 xl:mt-6">
        <Head>
          <title>{title || "Quirrel"}</title>
          <link rel="icon" href="/favicon.ico" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@quirrel_dev" />
          <meta name="twitter:title" content="Job Queueing for Serverless" />
          <meta
            name="twitter:description"
            content="Quirrel makes job queues simple as cake. Set up in 5 minutes - even works locally!"
          />
          <meta name="twitter:image" content="https://4ac32697a5b2.ngrok.io/img/twitter.png" />
        </Head>

        <div className="relative py-2 px-4 sm:px-8 max-w-6xl mx-auto">
          <nav className="relative flex items-center justify-between">
            <div className="flex items-center flex-grow flex-shrink-0 lg:flex-grow-0">
              <div className="flex items-center justify-between w-full lg:w-auto">
                <Link href="/">
                  <a>
                    <span className="flex items-center ml-1">
                      <Image
                        aria-label="Home"
                        width={40}
                        height={40}
                        src="/img/horn_transparent.png"
                        alt="Logo"
                      />
                      <h1 className="ml-3 text-3xl font-semibold text-orange-600">Quirrel</h1>
                    </span>
                  </a>
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
                      <svg
                        className="h-6 w-6"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
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
                <div className="px-5 pt-3 flex items-center justify-between">
                  <div>
                    <Image width={40} height={40} src="/img/horn_transparent.png" alt="Logo" />
                  </div>
                  <div className="-mr-2">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                      aria-label="Close menu"
                      onClick={() => setMobileMenuOpen((v) => !v)}
                    >
                      <svg
                        className="h-6 w-6"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
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
                        {({ onClick, isLoggedIn }) => (
                          <>
                            <a
                              href="https://github.com/quirrel-dev/quirrel/issues/new/choose"
                              target="_blank"
                              className="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
                              role="menuitem"
                            >
                              Feedback
                            </a>

                            {isLoggedIn ? (
                              <span className="flex">
                                <Link href="/dashboard">
                                  <a className="block w-full px-5 py-3 text-center font-medium bg-gray-50 hover:bg-gray-100 hover:text-orange-700 focus:outline-none focus:bg-gray-100 focus:text-orange-700 transition duration-150 ease-in-out">
                                    Dashboard
                                  </a>
                                </Link>
                                <a
                                  className="block w-full px-5 py-3 text-center font-medium text-orange-600 bg-gray-50 hover:bg-gray-100 hover:text-orange-700 focus:outline-none focus:bg-gray-100 focus:text-orange-700 transition duration-150 ease-in-out"
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
                                  className="block w-full px-5 py-3 text-center font-medium text-orange-600 bg-gray-50 hover:bg-gray-100 hover:text-orange-700 focus:outline-none focus:bg-gray-100 focus:text-orange-700 transition duration-150 ease-in-out"
                                  role="menuitem"
                                  onClick={() => {
                                    onClick()
                                    setMobileMenuOpen(false)
                                  }}
                                >
                                  {isLoggedIn ? "Log Out" : "Log In"}
                                </a>
                              </div>
                            )}
                          </>
                        )}
                      </LoginState>
                    </Suspense>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <main className="lg:my-16 px-4 sm:px-8 max-w-6xl mx-auto" style={{ minHeight: "50vh" }}>
          <Suspense fallback="Loading ...">{children}</Suspense>
        </main>

        <footer className="px-8 w-full py-8 bg-gray-100">
          <div className="mx-auto max-w-screen-xl grid grid-cols-4 md:grid-cols-6 lg:grid-cols-10 gap-10 lg:gap-20 mb-3">
            <div className="col-span-4 md:col-span-3">
              <Link href="/">
                <a>
                  <span className="flex items-center ml-1">
                    <Image
                      height={40}
                      width={40}
                      aria-label="Home"
                      src="/img/horn_transparent.png"
                      alt="Logo"
                    />
                    <h1 className="ml-3 text-3xl font-semibold text-orange-600">Quirrel</h1>
                  </span>
                </a>
              </Link>
              <p className="text-md my-4 text-gray-500">
                Job Queueing for Serverless.
                <br />
                <br />
                Simon Knott
                <br />
                Dreilindenstraße 34
                <br />
                14109 Berlin
                <br />
                Germany
                <br />
              </p>
            </div>
            <nav className="col-span-1">
              <p className="uppercase text-gray-600 text-xs tracking-wider font-medium mb-3">
                Product
              </p>

              <Link href="/#features">
                <a className="flex mb-3 md:mb-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors duration-100 ease-in">
                  Features
                </a>
              </Link>

              <Suspense fallback={null}>
                <LoginState>
                  {({ isLoggedIn }) =>
                    isLoggedIn ? (
                      <Link href="/dashboard">
                        <a className="flex mb-3 md:mb-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors duration-100 ease-in">
                          Dashboard
                        </a>
                      </Link>
                    ) : (
                      <></>
                    )
                  }
                </LoginState>
              </Suspense>

              <a
                href="https://status.quirrel.dev"
                target="blank"
                className="flex mb-3 md:mb-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors duration-100 ease-in"
              >
                Status
              </a>
            </nav>

            <nav className="col-span-1">
              <p className="uppercase text-gray-600 text-xs tracking-wider font-medium mb-3">
                Links
              </p>

              <a
                href="https://docs.quirrel.dev"
                target="blank"
                className="flex mb-3 md:mb-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors duration-100 ease-in"
              >
                Documentation
              </a>
            </nav>

            <nav className="col-span-2">
              <p className="uppercase text-gray-600 text-xs tracking-wider font-medium mb-3">
                Contact
              </p>
              <a
                href="https://dev.to/quirrel"
                target="blank"
                className="flex mb-3 md:mb-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors duration-100 ease-in"
              >
                Blog
              </a>
              <a
                href="https://twitter.com/skn0tt"
                target="blank"
                className="flex mb-3 md:mb-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors duration-100 ease-in"
              >
                Twitter
              </a>
              <a
                href="mailto:info@quirrel.dev"
                target="blank"
                className="flex mb-3 md:mb-2 text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors duration-100 ease-in"
              >
                Email
              </a>
            </nav>
          </div>
          <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-t border-gray-200 pt-10 mt-10">
            <p className="text-gray-700 font-medium text-sm text-left mb-6 md:mb-0">
              © Copyright 2020 Simon Knott. All Rights Reserved.
            </p>
            <div className="flex items-start md:items-center justify-start md:justify-center space-x-6">
              <Link href="/terms">
                <a className="font-medium text-sm text-gray-700 hover:text-gray-600 transition-colors duration-100 ease-in">
                  Terms
                </a>
              </Link>

              <Link href="/privacy">
                <a className="font-medium text-sm text-gray-700 hover:text-gray-600 transition-colors duration-100 ease-in">
                  Privacy
                </a>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Layout
