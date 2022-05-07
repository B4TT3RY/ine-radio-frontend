import Head from 'next/head'
import useAuth from '../../hooks/useAuth'
import DashboardFrame from '../../components/dashboard/DashboardFrame'
import useSWR from 'swr'
import { apiFetcher, BanListResponse, FetcherError, Role } from '../../api'
import { Virtuoso } from 'react-virtuoso'
import dayjs from 'dayjs'
import { classNames } from '../../utils'
import { useEffect, useState } from 'react'
import { getRegExp } from 'korean-regexp'
import Button from '../../components/button/Button'
import XIcon from '@heroicons/react/outline/XIcon'

interface FormValues {
  storyId: string
}

export default function DashboardDetailViewIndex() {
  const [auth, authError] = useAuth()
  const [regex, setRegex] = useState<RegExp | undefined>()

  const { data: banList, error: banListError } = useSWR<BanListResponse[], FetcherError>('/ban/list', apiFetcher, {
    refreshInterval: 30000,
  })

  const [filteredList, setFilteredList] = useState<BanListResponse[] | undefined>(banList)

  useEffect(() => {
    let list = banList

    if (regex) {
      list = list?.filter((s) => regex.test(s.id))
    }

    setFilteredList(list)
  }, [banList, regex])

  return (
    <>
      <Head>
        <title>밴 리스트 | 아이네의 깃털 라디오</title>
      </Head>
      <DashboardFrame
        auth={auth}
        authError={authError}
        currentUrl='/dashboard/ban'
        title='밴 리스트'
        subTitle='요주의 인물 리스트를 관리할 수 있어요.'
      >
        {!banList && banListError && (
          <>
            <h1>문제가 발생했어요.</h1>
            <p>
              [{banListError.body.error}] {banListError.body.message}
            </p>
          </>
        )}
        {banList && (
          <>
            {auth && auth.role == Role.ADMIN && (
              <div className='flex flex-wrap justify-end gap-3 pb-3'>
                <Button extraClassName='whitespace-nowrap'>사용자 추가</Button>
              </div>
            )}
            <input
              type='search'
              name='search'
              onChange={(e) => setRegex(getRegExp(e.target.value, { initialSearch: true }))}
              placeholder='검색할 아이디를 입력해주세요'
              className={classNames(
                'text-base p-3 w-full transition-all shadow-sm rounded-xl mb-4',
                'focus:ring-purple-500 focus:border-purple-500 border border-gray-300'
              )}
            />
            <Virtuoso
              style={{ height: undefined }}
              className='h-full shadow rounded-2xl bg-gray-50'
              data={filteredList}
              itemContent={(_, ban) => (
                <div
                  className={classNames(
                    'flex justify-between',
                    'bg-white p-4 border-b-[1px] cursor-pointer',
                    'hover:bg-gray-100'
                  )}
                >
                  <div>
                    <h1 className='text-xl font-bold'>{ban.id}</h1>
                    <p className='select-none'>{dayjs(ban.createdAt).format('YYYY-MM-DD HH:MM')}에 추가됨</p>
                  </div>

                  {auth && auth.role == Role.ADMIN && (
                    <div className='flex items-center justify-center cursor-pointer group' onClick={() => {}}>
                      <XIcon className='text-red-500 group-hover:text-red-600 w-10 h-10' />
                    </div>
                  )}
                </div>
              )}
            />
          </>
        )}
      </DashboardFrame>
    </>
  )
}
