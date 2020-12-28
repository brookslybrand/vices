import Link from 'next/link'
import { auth } from 'firebaseApp'
import { useAuth, User } from 'hooks/useAuth'
import { useRouter } from 'next/router'
import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuPopover,
  MenuLink,
} from '@reach/menu-button'
import VisuallyHidden from '@reach/visually-hidden'

function Navigation() {
  const { state } = useAuth()

  return (
    <div className="flex justify-between p-4">
      {/* for now all navigation is hidden if you're not logged in */}
      {/* <nav className="space-x-2">
        <Link href="/">
          <a className="hover:text-green-800">Home</a>
        </Link>
        <Link href="/tobacco/view-purchases">
          <a className="hover:text-green-800">View tobacco purchase</a>
        </Link>
        {state === 'loggedIn' ? (
          <>
            <Link href="/tobacco/add-purchase">
              <a className="hover:text-green-800">Add tobacco purchase</a>
            </Link>
          </>
        ) : null}
      </nav> */}
      <NavMenu />
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

function NavMenu() {
  const { state } = useAuth()

  return (
    <Menu>
      <MenuButton>
        <VisuallyHidden>Menu</VisuallyHidden>
        <svg
          aria-hidden
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="text-gray-800 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </MenuButton>
      <MenuList className="bg-gray-100">
        <Link href="/" passHref>
          <MenuLink
            as="a"
            // className="hover:bg-gray-700 hover:text-white focus:bg-gray-700 focus:text-white"
          >
            Home
          </MenuLink>
        </Link>
        <Link href="/tobacco/view-purchases" passHref>
          <MenuLink as="a" className="">
            View tobacco purchase
          </MenuLink>
        </Link>

        {state === 'loggedIn' ? (
          <>
            <Link href="/tobacco/add-purchase" passHref>
              <MenuLink as="a" className="">
                Add tobacco purchase
              </MenuLink>
            </Link>
          </>
        ) : null}
      </MenuList>
    </Menu>
  )
}
