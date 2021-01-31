import tw, { css } from 'twin.macro'
import Link from 'next/link'
import type { LinkProps } from 'next/link'
import { auth } from 'firebaseApp'
import { useAuth, User } from 'hooks/useAuth'
import { useRouter } from 'next/router'
import { Menu, MenuList, MenuButton, MenuLink } from '@reach/menu-button'
import VisuallyHidden from '@reach/visually-hidden'

function Navigation() {
  const { state } = useAuth()

  return (
    <div tw="flex justify-between p-4">
      {/* for now all navigation is hidden if you're not logged in */}
      {/* <nav tw="space-x-2">
        <Link href="/">
          <a tw="hover:text-green-800">Home</a>
        </Link>
        <Link href="/tobacco/view-purchases">
          <a tw="hover:text-green-800">View tobacco purchase</a>
        </Link>
        {state === 'loggedIn' ? (
          <>
            <Link href="/tobacco/add-purchase">
              <a tw="hover:text-green-800">Add tobacco purchase</a>
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
      <button tw="hover:text-green-800" onClick={() => auth.signOut()}>
        Logout
      </button>
    )
  }
  return (
    <Link href="/login">
      <a tw="hover:text-green-800">Login</a>
    </Link>
  )
}

function NavMenu() {
  const { state } = useAuth()

  return (
    <Menu>
      <MenuButton>
        <VisuallyHidden>Menu</VisuallyHidden>
        <MenuIcon />
      </MenuButton>
      <MenuList tw="bg-gray-100 whitespace-nowrap outline-none py-3 px-0 mt-2 ml-1 border border-gray-500 rounded-sm">
        <CustomMenuLink href="/">Home</CustomMenuLink>
        <CustomMenuLink href="/tobacco/view-purchases">
          View tobacco purchase
        </CustomMenuLink>

        {state === 'loggedIn' ? (
          <CustomMenuLink href="/tobacco/add-purchase">
            Add tobacco purchase
          </CustomMenuLink>
        ) : null}
      </MenuList>
    </Menu>
  )
}

type CustomMenuLinkProps = {
  href: LinkProps['href']
  children: React.ReactNode
}

function CustomMenuLink({ href, children }: CustomMenuLinkProps) {
  return (
    <Link href={href} passHref>
      <MenuLink as="a" css={menuLinkCss}>
        {children}
      </MenuLink>
    </Link>
  )
}

const menuLinkCss = [
  tw`block px-4 py-1 text-xl outline-none cursor-pointer font-extralight font-display`,
  css`
    &[data-selected] {
      ${tw`font-normal text-white bg-gray-400 outline-none select-none`}
    }
  `,
]

function MenuIcon() {
  return (
    <svg
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      tw="text-gray-800 stroke-current"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  )
}
