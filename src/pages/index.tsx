import Link from 'next/link'
import { auth } from 'firebaseApp'
import { useAuth } from 'hooks/useAuth'

export default function Home() {
  return (
    <main className="m-4">
      <LogoutButton />
      <h1>A whole lot of nothing</h1>
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
