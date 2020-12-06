import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from 'firebaseApp'

export { AuthProvider, useAuth }

type User =
  | { state: 'checking' | 'loggedOut' }
  | {
      state: 'loggedIn'
      name?: string | null
      email?: string | null
    }
const AuthContext = createContext<undefined | User>(undefined)

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ state: 'checking' })

  useEffect(() =>
    auth.onAuthStateChanged(
      (firebaseUser) => {
        if (firebaseUser === null) {
          setUser({ state: 'loggedOut' })
        } else {
          setUser({
            state: 'loggedIn',
            name: firebaseUser?.displayName,
            email: firebaseUser?.email,
          })
        }
      },
      (error) => {
        console.warn(error)
        setUser({ state: 'loggedOut' })
      }
    )
  )

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

function useAuth() {
  const user = useContext(AuthContext)
  if (user === undefined) {
    throw new Error(`useAuth must called in a child of AuthProvider`)
  }
  return user
}
