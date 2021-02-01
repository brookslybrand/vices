import { TobaccoPurchase } from 'firebaseApp'
import { TOBACCO_PURCHASES } from 'constants/collections'
import useCollection from 'hooks/useCollection'
import { format, addDays } from 'date-fns'
import PageLayout from 'components/page-layout'
import 'twin.macro'

function Home() {
  const { docs: tobaccoPurchases, state } = useCollection<TobaccoPurchase>(
    TOBACCO_PURCHASES,
    { criteria: 'date', desc: false }
  )

  return (
    <h1 tw="text-4xl">
      Next Purchase Date:{' '}
      <span>
        {state === 'loading'
          ? 'Loading...'
          : state === 'loaded'
          ? format(getNextPurchaseDate(tobaccoPurchases), 'MM/dd/yy')
          : 'Something went wrong'}
      </span>
    </h1>
  )
}

Home.PageLayout = ({ children }: { children: React.ReactNode }) => {
  return <PageLayout title="Vices" children={children} />
}

export default Home

const daysInMonth = 30
function getNextPurchaseDate(purchases: TobaccoPurchase[]) {
  // get the first purchase date
  const firstPurchaseDate = purchases[0].date.toDate()
  // continuing adding the amount of each of the purchases to get next purchase date
  return purchases.reduce((nextPurchaseDate, { amount }) => {
    return addDays(nextPurchaseDate, amount * daysInMonth)
  }, firstPurchaseDate)
}
