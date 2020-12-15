import Link from 'next/link'
import { auth, TobaccoPurchase } from 'firebaseApp'
import { useAuth } from 'hooks/useAuth'
import { TOBACCO_PURCHASES } from 'constants/collections'
import useCollection from 'hooks/useCollection'
import { format, addDays } from 'date-fns'

export default function Home() {
  return (
    <main className="m-4">
      <div className="flex space-x-2">
        <LogoutButton />
        <nav>
          <Link href="/tobacco">
            <a className="hover:text-green-800">Add tobacco purchase</a>
          </Link>
        </nav>
      </div>
      <NextPurchaseDate />
    </main>
  )
}

function LogoutButton() {
  const { state } = useAuth()
  if (state === 'loggedIn') {
    return (
      <button className="hover:text-green-800" onClick={() => auth.signOut()}>
        Logout
      </button>
    )
  } else {
    return (
      <Link href="/login">
        <a className="hover:text-green-800">Login</a>
      </Link>
    )
  }
}

function NextPurchaseDate() {
  const { docs: tobaccoPurchases, state } = useCollection<TobaccoPurchase>(
    TOBACCO_PURCHASES
  )

  return (
    <article className="flex flex-col items-center mt-8">
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
    </article>
  )
}

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
