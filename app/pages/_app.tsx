import { AppProps, Router, useRouter, useSession } from "blitz"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
import { queryCache } from "react-query"
import React, { Suspense, useEffect } from "react"
import Sentry from "integrations/sentry"

import "app/styles/index.css"
import ErrorComponent from "app/components/ErrorComponent"

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session.userId) {
      Sentry.setUser({
        id: session.userId,
      })
    }
  }, [session])

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      onReset={() => {
        // This ensures the Blitz useQuery hooks will automatically refetch
        // data any time you reset the error boundary
        queryCache.resetErrorBoundaries()
      }}
      onError={(error, componentStack) => {
        Sentry.captureException(error, {
          contexts: {
            react: {
              componentStack,
            },
          },
        })
      }}
      resetKeys={[router.asPath]}
    >
      <Suspense fallback={null}>{getLayout(<Component {...pageProps} />)}</Suspense>
    </ErrorBoundary>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  useEffect(() => {
    if (error?.name === "AuthenticationError") {
      Router.push("/login")
      resetErrorBoundary()
    }
  }, [error?.name])

  if (error?.name === "AuthorizationError") {
    return (
      <ErrorComponent
        statusCode={(error as any).statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error?.message || error?.name || "Unknown Error"}
      />
    )
  }
}
