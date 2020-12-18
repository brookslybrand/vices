import Head from 'next/head'
import Navigation from 'components/navigation'

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
      <Head>
        <title>{title}</title>
      </Head>
      <Navigation />
      <main className="flex flex-col items-center mt-8">{children}</main>
    </>
  )
}

export default PageLayout
