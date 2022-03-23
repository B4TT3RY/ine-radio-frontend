import DashboardFrame from '../../../components/dashboard/DashboardFrame'
import useAuth from '../../../hooks/useAuth'

export default function DashboardStoryIndex() {
  const [auth, authError] = useAuth()
  
  return (
    <>
      <DashboardFrame
        auth={auth}
        authError={authError}
        currentUrl='/dashboard/story'
        title='사연 관리'
        subTitle='녹색 테두리가 현재 활성화 된 사연이에요.'
      >
        <h1>a</h1>
      </DashboardFrame>
    </>
  )
}
