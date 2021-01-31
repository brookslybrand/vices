import 'twin.macro'
import Head from 'next/head'
import { firebase, auth } from 'firebaseApp'
import PageLayout from 'components/page-layout'
import useAuthRedirect from 'hooks/useAuthRedirect'

const handleLogin = () => {
  const provider = new firebase.auth.GoogleAuthProvider()
  auth
    .signInWithPopup(provider)
    .then((result) => {})
    .catch((error) => {
      console.warn(error)
    })
}
function Login() {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <main tw="w-40 h-screen mx-auto mt-8">
        <button
          tw="w-full px-4 py-2 text-2xl bg-green-800 rounded-md text-gray-50"
          onClick={handleLogin}
        >
          Login
        </button>
      </main>
    </>
  )
}

function LoginPageLayout({ children }: { children: React.ReactNode }) {
  // redirect home once logged in
  useAuthRedirect('/', 'loggedIn')
  return <PageLayout title="Login" children={children} />
}

Login.PageLayout = LoginPageLayout

export default Login
