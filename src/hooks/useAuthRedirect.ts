import { useRouter } from 'next/router'
import { useAuth, User } from 'hooks/useAuth'
import { useEffect } from 'react'

/**
 *
 * @param to The route to redirect to. Default's to the home page.
 * @param redirectCriteria The auth state the user must be in to trigger the redirect.
 */
export default function useAuthRedirect(
  to: string = '/',
  redirectCriteria: User['state'] = 'loggedOut'
) {
  const router = useRouter()
  const { state: authState } = useAuth()

  useEffect(() => {
    if (authState === redirectCriteria) {
      router.replace(to)
    }
  }, [authState, redirectCriteria, router, to])
}
