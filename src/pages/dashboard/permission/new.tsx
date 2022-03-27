import { getRegExp } from 'korean-regexp'
import Error from 'next/error'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import useSWR from 'swr'
import { apiFetcher, AuthResponse, FetcherError, Role } from '../../../api'
import DashboardFrame from '../../../components/dashboard/DashboardFrame'
import SimpleUserProfile from '../../../components/dashboard/SimpleUserProfile'
import useAuth from '../../../hooks/useAuth'

export default function PermissionIndex() {
  const [auth, authError] = useAuth()
  const [regex, setRegex] = useState<RegExp | undefined>()
  const { data: users, error: usersError } = useSWR<AuthResponse[], FetcherError>(`/auth/getUsers`, apiFetcher)
  const [filteredUsers, setFilteredUsers] = useState(users)

  useEffect(() => {
    if (regex) {
      setFilteredUsers(
        users?.filter((user) => user.role == Role.USER && (regex?.test(user.login) || regex?.test(user.displayName)))
      )
    } else {
      setFilteredUsers(users?.filter((user) => user.role == Role.USER))
    }
  }, [regex, users])

  if (auth?.role == Role.STAFF) {
    return <Error statusCode={401} />
  }

  return (
    <>
      <Head>
        <title>스탭 추가 | 아이네의 깃털 라디오</title>
      </Head>
      <DashboardFrame auth={auth} authError={authError} currentUrl='/dashboard/permission' title='스탭 추가'>
        <div className='h-full flex flex-col'>
          <input
            type='search'
            name='search'
            onChange={(e) => setRegex(getRegExp(e.target.value, { initialSearch: true }))}
            placeholder='아이디를 입력해주세요'
            className='text-base p-3 w-full transition-all shadow-sm focus:ring-purple-500 focus:border-purple-500 border border-gray-300 rounded-xl'
          />
          <Virtuoso
            style={{ height: undefined }}
            className='flex-1 mt-3'
            data={filteredUsers}
            itemContent={(_, user) => (
              <div
                className='select-none cursor-pointer'
                onClick={() => {
                  const answer = confirm(`${user.displayName}(${user.login})님을 스탭으로 추가하시겠어요?`)
                  if (!answer) {
                    return
                  }
                  // TODO: 스탭 추가 구현
                }}
              >
                <SimpleUserProfile className='mb-3' user={user} />
              </div>
            )}
          />
        </div>
      </DashboardFrame>
    </>
  )
}
