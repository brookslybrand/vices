import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from 'fb/firebase-client'

export { AuthProvider, useAuth }

export type User =
  | { state: 'checking' | 'loggedOut' }
  | {
      state: 'loggedIn'
      name?: string | null
      email?: string | null
    }
const AuthContext = createContext<undefined | User>(undefined)

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({ state: 'checking' })

  useEffect(() => {
    let cancel = false
    const unsubscribe = auth.onAuthStateChanged(
      (firebaseUser) => {
        if (cancel) return

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

    return () => {
      cancel = true
      unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

function useAuth() {
  const user = useContext(AuthContext)
  if (user === undefined) {
    throw new Error(`useAuth must called in a child of AuthProvider`)
  }
  return user
}
