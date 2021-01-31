import Head from 'next/head'
import Navigation from 'components/navigation'
import 'twin.macro'

// who knows, this may be too early of an abstraction, but if all pages
// have this layout then let's just put it here (it could be in _app as well)
function PageLayout({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <>
      <header>
        <Head>
          <title>{title}</title>
        </Head>
        <Navigation />
      </header>
      <main tw="flex flex-col items-center mt-8">{children}</main>
    </>
  )
}

export default PageLayout
