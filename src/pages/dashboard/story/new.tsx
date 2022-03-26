import Head from 'next/head'
import DashboardFrame from '../../../components/dashboard/DashboardFrame'
import useAuth from '../../../hooks/useAuth'

export default function DashboardStoryIndex() {
  const [auth, authError] = useAuth()

  return (
    <>
      <Head>
        <title>사연 생성 | 아이네의 깃털 라디오</title>
      </Head>
      <DashboardFrame
        auth={auth}
        authError={authError}
        currentUrl='/dashboard/story'
        title='사연 생성'
      >
        
      </DashboardFrame>
    </>
  )
}
