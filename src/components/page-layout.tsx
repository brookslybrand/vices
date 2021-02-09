import Head from 'next/head'
import Navigation from 'components/navigation'
import 'twin.macro'

// who knows, this may be too early of an abstraction, but if all pages
// have this layout then let's just put it here (it could be in _app as well)
function PageLayout({
  title,
  children,
  footer,
}: {
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div tw="flex flex-col min-h-screen">
        <header>
          <Navigation />
        </header>
        <main tw="flex flex-col items-center mx-4 flex-grow">{children}</main>
        <footer tw="w-full py-2 px-4 justify-self-end">{footer}</footer>
      </div>
    </>
  )
}

export default PageLayout
