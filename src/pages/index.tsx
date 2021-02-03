import 'twin.macro'
import { db } from 'fb/firebase-admin'
import { TOBACCO_PURCHASES } from 'constants/collections'
import { format, addDays } from 'date-fns'

import type { TobaccoPurchase } from 'fb/firebase-client'
import PageLayout from 'components/page-layout'
import type { InferGetServerSidePropsType } from 'next'

function Home({
  nextPurchaseDate,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <h1 tw="text-4xl">
      Next Purchase Date: <span>{nextPurchaseDate}</span>
    </h1>
  )
}

Home.PageLayout = ({ children }: { children: React.ReactNode }) => {
  return <PageLayout title="Vices" children={children} />
}

export default Home

export async function getServerSideProps() {
  const tobaccoPurchasesDocs = await db
    .collection(TOBACCO_PURCHASES)
    .orderBy('date', 'asc')
    .get()
  const tobaccoPurchases = tobaccoPurchasesDocs.docs.map((doc) => {
    const data = doc.data() as TobaccoPurchase
    return { ...data, id: doc.id }
  })

  return {
    props: {
      nextPurchaseDate: format(
        getNextPurchaseDate(tobaccoPurchases),
        'MM/dd/yy'
      ),
    },
  }
}

const daysInMonth = 30
function getNextPurchaseDate(purchases: TobaccoPurchase[]) {
  // get the first purchase date
  const firstPurchaseDate = purchases[0].date.toDate()
  // continuing adding the amount of each of the purchases to get next purchase date
  return purchases.reduce((nextPurchaseDate, { amount }) => {
    return addDays(nextPurchaseDate, amount * daysInMonth)
  }, firstPurchaseDate)
}
