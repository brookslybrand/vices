import { TobaccoPurchase } from 'firebaseApp'
import { TOBACCO_PURCHASES } from 'constants/collections'
import useCollection from 'hooks/useCollection'
import { format, addDays } from 'date-fns'
import PageLayout from 'components/page-layout'

function Home() {
  const { docs: tobaccoPurchases, state } = useCollection<TobaccoPurchase>(
    TOBACCO_PURCHASES
  )

  return (
    <h1 className="text-4xl">
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
  return new Date(
    purchases.reduce((nextPurchaseDate, { date, amount }) => {
      // find the max between the previous next date and the last purchase date
      nextPurchaseDate = Math.max(nextPurchaseDate, date.toDate().valueOf())
      // add more days to get a future date
      return addDays(nextPurchaseDate, amount * daysInMonth).valueOf()
    }, -Infinity)
  )
}
