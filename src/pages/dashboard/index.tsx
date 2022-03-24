import Head from 'next/head'
import useSWR from 'swr'
import { apiFetcher, FetcherError, StoryInfoResponse } from '../../api'
import DashboardFrame from '../../components/dashboard/DashboardFrame'
import StoryInfoCard from '../../components/dashboard/StoryInfoCard'
import useAuth from '../../hooks/useAuth'

export default function DashboardIndex() {
  const [auth, authError] = useAuth()
  const { data: storyInfo, error: storyInfoError } = useSWR<StoryInfoResponse, FetcherError>('/storyinfo', apiFetcher, {
    refreshInterval: 30000,
  })

  return (
    <>
      <Head>
        <title>대시보드 | 아이네의 깃털 라디오</title>
      </Head>
      <DashboardFrame auth={auth} authError={authError} currentUrl='/dashboard' title='대시보드'>
        {!storyInfo && storyInfoError && <StoryInfoCard title='현재 활성화 된 사연' variable='오류가 발생했습니다.' />}
        {!storyInfo && !storyInfoError && <StoryInfoCard title='현재 활성화 된 사연' />}
        {storyInfo && !storyInfoError && <StoryInfoCard title='현재 활성화 된 사연' variable={storyInfo.title} />}
      </DashboardFrame>
    </>
  )
}
