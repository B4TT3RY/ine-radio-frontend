import { PlusIcon } from '@heroicons/react/outline'
import Error from 'next/error'
import Head from 'next/head'
import Link from 'next/link'
import useSWR from 'swr'
import { apiFetcher, AuthResponse, FetcherError, Role } from '../../../api'
import DashboardFrame from '../../../components/dashboard/DashboardFrame'
import SimpleUserProfile from '../../../components/dashboard/SimpleUserProfile'
import useAuth from '../../../hooks/useAuth'

export default function PermissionIndex() {
  const [auth, authError] = useAuth()
  const { data: users, error: usersError } = useSWR<AuthResponse[], FetcherError>(`/auth/getUsers`, apiFetcher)

  if (auth?.role == Role.STAFF) {
    return <Error statusCode={401} />
  }

  return (
    <>
      <Head>
        <title>사연 관리 | 아이네의 깃털 라디오</title>
      </Head>
      <DashboardFrame auth={auth} authError={authError} currentUrl='/dashboard/permission' title='권한 관리'>
        <ul className='space-y-3'>
          <h2 className='text-xl font-semibold'>ADMIN</h2>
          {users &&
            users
              .filter((users) => users.role == Role.ADMIN)
              .map((user) => (
                <li key={user.login}>
                  <SimpleUserProfile user={user} />
                </li>
              ))}
          <h2 className='text-xl font-semibold'>STREAMER</h2>
          {users &&
            users
              .filter((users) => users.role == Role.STREAMER)
              .map((user) => (
                <li key={user.login}>
                  <SimpleUserProfile user={user} />
                </li>
              ))}
          <h2 className='text-xl font-semibold'>STAFF</h2>
          {auth && (
            <li>
              <Link href='/dashboard/permission/new'>
                <a className='flex items-center justify-center border-4 border-dashed border-gray-400 rounded-2xl h-[4.5rem]'>
                  <PlusIcon className='w-12 h-12 text-gray-400' />
                </a>
              </Link>
            </li>
          )}
          {users &&
            users
              .filter((users) => users.role == Role.STAFF)
              .map((user) => (
                <li key={user.login}>
                  <SimpleUserProfile user={user} />
                </li>
              ))}
        </ul>
      </DashboardFrame>
    </>
  )
}
