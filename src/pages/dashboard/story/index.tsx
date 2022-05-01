import { PlusIcon } from '@heroicons/react/outline'
import Error from 'next/error'
import Head from 'next/head'
import Link from 'next/link'
import useSWR from 'swr'
import { apiFetcher, FetcherError, StoryInfoListResponse } from '../../../api'
import DashboardFrame from '../../../components/dashboard/DashboardFrame'
import StoryInfo from '../../../components/dashboard/StoryInfo'
import LoadingSpinner from '../../../components/LoadingSpinner'
import useAuth from '../../../hooks/useAuth'

export default function DashboardStoryIndex() {
  const [auth, authError] = useAuth()

  const { data: storyInfoList, error: storyInfoListError } = useSWR<StoryInfoListResponse[], FetcherError>(
    '/storyinfo/list',
    apiFetcher,
    {
      refreshInterval: 30000,
    }
  )

  if (storyInfoListError) {
    return <Error statusCode={storyInfoListError.code} />
  }

  return (
    <>
      <Head>
        <title>사연 관리 | 아이네의 깃털 라디오</title>
      </Head>
      <DashboardFrame
        auth={auth}
        authError={authError}
        currentUrl='/dashboard/story'
        title='사연 관리'
        subTitle='녹색 테두리가 현재 활성화 된 사연이에요.'
      >
        <ul className='space-y-3'>
          <li>
            <Link href='/dashboard/story/new'>
              <a className='group flex items-center justify-center border-4 border-dashed border-gray-400 hover:border-gray-500 rounded-2xl h-[5.5rem]'>
                <PlusIcon className='w-12 h-12 text-gray-400 group-hover:text-gray-500' />
              </a>
            </Link>
          </li>
          {storyInfoList ? (
            storyInfoList.map((storyInfo) => (
              <li key={storyInfo.id}>
                <StoryInfo storyInfo={storyInfo} />
              </li>
            ))
          ) : (
            <div className='flex items-center justify-center'>
              <LoadingSpinner className='w-12 h-12' />
            </div>
          )}
        </ul>
      </DashboardFrame>
    </>
  )
}
