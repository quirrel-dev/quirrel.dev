import { AppProps, ErrorComponent, Router } from "blitz"
import { ErrorBoundary, FallbackProps } from "react-error-boundary"
import { queryCache } from "react-query"
import React, { Suspense, useEffect } from "react"

import "app/styles/index.css"
import { HeapScript } from "app/hooks/useHeap"

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <>
      <HeapScript />
      <ErrorBoundary
        FallbackComponent={RootErrorFallback}
        onReset={() => {
          // This ensures the Blitz useQuery hooks will automatically refetch
          // data any time you reset the error boundary
          queryCache.resetErrorBoundaries()
        }}
      >
        <Suspense fallback={null}>{getLayout(<Component {...pageProps} />)}</Suspense>
      </ErrorBoundary>
    </>
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
        title={error?.message || error?.name}
      />
    )
  }
}
