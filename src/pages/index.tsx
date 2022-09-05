import 'twin.macro'
import { db } from 'fb/firebase-admin'
import { TOBACCO_PURCHASES } from 'constants/collections'
import { format, addDays } from 'date-fns'

import type { TobaccoPurchase } from 'fb/firebase-client'
import PageLayout from 'components/page-layout'
import type { InferGetServerSidePropsType } from 'next'
import { Pipe, PipeAttribution } from 'components/pipe'

function Home({
  nextPurchaseDate,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Pipe tw="w-1/2 h-1/2 sm:(w-1/3 h-1/3) md:(w-1/4 h-1/4) lg:(w-1/5 h-1/5)" />
      <h1 tw="text-2xl md:text-4xl">
        Next Purchase Date: <span>{nextPurchaseDate}</span>
      </h1>
    </>
  )
}

Home.PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageLayout title="Vices" footer={<PipeAttribution />}>
      {children}
    </PageLayout>
  )
}

export default Home

const daysInMonth = 30
export async function getServerSideProps() {
  const lastPurchaseDocs = await db
    .collection(TOBACCO_PURCHASES)
    .orderBy('date', 'desc')
    .limit(1)
    .get()

  const nextPurchaseDate = lastPurchaseDocs.docs.map((doc) => {
    const data = doc.data() as TobaccoPurchase
    return addDays(data.date.toDate(), data.amount * daysInMonth)
  })[0]

  return {
    props: {
      nextPurchaseDate: format(nextPurchaseDate, 'MM/dd/yy'),
    },
  }
}
