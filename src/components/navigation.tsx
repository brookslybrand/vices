import Link from 'next/link'
import { auth } from 'firebaseApp'
import { useAuth, User } from 'hooks/useAuth'
import { useRouter } from 'next/router'

function Navigation() {
  const { state } = useAuth()

  return (
    <div className="flex justify-between p-4">
      {/* for now all navigation is hidden if you're not logged in */}
      <nav className="space-x-2">
        <Link href="/">
          <a className="hover:text-green-800">Home</a>
        </Link>
        {state === 'loggedIn' ? (
          <>
            <Link href="/tobacco/add-purchase">
              <a className="hover:text-green-800">Add tobacco purchase</a>
            </Link>
          </>
        ) : null}
      </nav>
      <LogoutButton loginState={state} />
    </div>
  )
}

export default Navigation

function LogoutButton({ loginState }: { loginState: User['state'] }) {
  const router = useRouter()

  // don't render the logout button if on the login page (seems like something that should be in login.tsx)
  if (router.pathname === '/login') return null

  if (loginState === 'loggedIn') {
    return (
      <button className="hover:text-green-800" onClick={() => auth.signOut()}>
        Logout
      </button>
    )
  }
  return (
    <Link href="/login">
      <a className="hover:text-green-800">Login</a>
    </Link>
  )
}
