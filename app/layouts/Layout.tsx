import { ReactNode, Suspense, useState } from "react"
import { Head, Link } from "blitz"
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
    <div className="mx-auto xl:mt-6" style={{ maxWidth: "1600px" }}>
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
            <Link href="/#getting-started">
              <a className="font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out">
                Getting Started
              </a>
            </Link>

            <Link href="/#features">
              <a className="ml-8 font-medium text-gray-500 hover:text-gray-900 transition duration-150 ease-in-out">
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

            {!hideLogin && (
              <Suspense fallback={null}>
                <LoginState>
                  {({ onClick, isLoggedIn }) =>
                    isLoggedIn ? (
                      <span className="float-right">
                        <Link href="/projects">
                          <a className="ml-8 font-medium text-gray-600 hover:text-gray-500 transition duration-150 ease-in-out">
                            Dashboard
                          </a>
                        </Link>
                        <Link href="/account">
                          <a className="ml-8 font-medium text-gray-600 hover:text-gray-500 transition duration-150 ease-in-out">
                            Account
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
                <Link href="/#getting-started">
                  <a
                    href="#"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:text-gray-900 focus:bg-gray-50 transition duration-150 ease-in-out"
                    role="menuitem"
                  >
                    Getting Started
                  </a>
                </Link>

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
                      {({ onClick, isLoggedIn }) =>
                        isLoggedIn ? (
                          <span className="flex">
                            <Link href="/projects">
                              <a className="block w-full px-5 py-3 text-center font-medium bg-gray-50 hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:bg-gray-100 focus:text-indigo-700 transition duration-150 ease-in-out">
                                Dashboard
                              </a>
                            </Link>
                            <Link href="/account">
                              <a className="block w-full px-5 py-3 text-center font-medium bg-gray-50 hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:bg-gray-100 focus:text-indigo-700 transition duration-150 ease-in-out">
                                Account
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

      {children}
    </div>
  )
}

export default Layout
