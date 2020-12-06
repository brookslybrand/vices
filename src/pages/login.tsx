import Head from 'next/head'
import { useRouter } from 'next/router'
import { firebase, auth } from 'firebaseApp'
import { useAuth } from 'hooks/useAuth'
import { useEffect } from 'react'

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
          className="w-full px-4 py-2 text-2xl text-white bg-green-800 rounded-md"
          onClick={handleLogin}
        >
          Login
        </button>
      </main>
    </>
  )
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
