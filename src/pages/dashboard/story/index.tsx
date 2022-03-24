import Error from 'next/error'
import Head from 'next/head'
import useSWR from 'swr'
import { apiFetcher, FetcherError, StoryInfoListResponse } from '../../../api'
import DashboardFrame from '../../../components/dashboard/DashboardFrame'
import StoryInfo from '../../../components/dashboard/StoryInfo'
import { Loader } from '../../../components/Loader'
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

  if (!storyInfoList) {
    return <Loader className='bg-gray-200' />
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
        {storyInfoList.map((storyInfo) => (
          <StoryInfo key={storyInfo.id} storyInfo={storyInfo} />
        ))}
      </DashboardFrame>
    </>
  )
}
