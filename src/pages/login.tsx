import Head from 'next/head'
import { useRouter } from 'next/router'
import { firebase, auth } from 'firebaseApp'
import { useAuth } from 'hooks/useAuth'
import { useEffect } from 'react'
import PageLayout from 'components/page-layout'

function Login() {
  const state = useLoggedInRedirect()
  // don't display the login screen if redirecting
  if (state === 'redirecting') {
    return null
  }

  const handleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth
      .signInWithPopup(provider)
      .then((result) => {})
      .catch((error) => {
        console.warn(error)
      })
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <main className="w-40 h-screen mx-auto mt-8">
        <button
          className="w-full px-4 py-2 text-2xl bg-green-800 rounded-md text-gray-50"
          onClick={handleLogin}
        >
          Login
        </button>
      </main>
    </>
  )
}

Login.PageLayout = ({ children }: { children: React.ReactNode }) => {
  return <PageLayout title="Login" children={children} />
}

export default Login

function useLoggedInRedirect() {
  const { state } = useAuth()
  const router = useRouter()
  // if logged in, redirect
  useEffect(() => {
    if (state === 'loggedIn') {
      router.replace('/')
    }
  }, [router, state])

  return state === 'loggedIn' ? 'redirecting' : 'staying'
}
