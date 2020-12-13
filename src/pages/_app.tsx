import React from 'react'
import { AuthProvider } from 'hooks/useAuth'
import type { AppProps } from 'next/app'

import '../styles/index.css'

type ComponentWithPageLayout = {
  Component: AppProps['Component'] & {
    PageLayout?: React.ComponentType
  }
}

// conditionally inject axe into the page.
// this only happens outside of production and in a browser (not SSR).
// taken from https://github.com/dequelabs/axe-core-npm/blob/develop/packages/react/examples/next.js/pages/_app.js
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  const ReactDOM = require('react-dom')
  const axe = require('@axe-core/react')
  // the empty object is to handle a bug: https://github.com/dequelabs/axe-core-npm/issues/176
  axe(React, ReactDOM, 1000, {})
}

export default function App({
  Component,
  pageProps,
}: AppProps & ComponentWithPageLayout) {
  // get a page root if one was set
  const PageLayout =
    Component.PageLayout ||
    (({ children }: { children: React.ReactNode }) => <>{children}</>)

  return (
    <PageLayout>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </PageLayout>
  )
}
