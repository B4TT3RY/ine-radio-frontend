import Error from 'next/error'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { apiFetcher, FetcherError, StoryInfoIdResponse } from '../../../api'
import DashboardFrame from '../../../components/dashboard/DashboardFrame'
import { Loader } from '../../../components/Loader'
import useAuth from '../../../hooks/useAuth'

export default function DashboardStoryById() {
  const [auth, authError] = useAuth()

  const router = useRouter()
  const { id } = router.query

  const { data: storyInfoId, error: storyInfoIdError } = useSWR<StoryInfoIdResponse, FetcherError>(
    `/storyinfo/${id}`,
    apiFetcher,
    {
      refreshInterval: 30000,
    }
  )

  if (storyInfoIdError) {
    return <Error statusCode={storyInfoIdError.code} />
  }

  if (!storyInfoId) {
    return <Loader show={true} />
  }

  const { storyinfo, stories } = storyInfoId

  return (
    <>
      <Head>
        <title>{storyinfo.title} | 아이네의 깃털 라디오</title>
      </Head>
      <DashboardFrame
        auth={auth}
        authError={authError}
        currentUrl='/dashboard/story'
        title={storyinfo.title}
        subTitle={storyinfo.subTitle ?? '설명 없음'}
      >
        <h1>a</h1>
      </DashboardFrame>
    </>
  )
}