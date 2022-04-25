import Head from 'next/head'
import { useRouter } from 'next/router'
import { apiFetchPost } from '../../../api'
import DashboardFrame from '../../../components/dashboard/DashboardFrame'
import StoryInfoForm, { FormValues } from '../../../components/dashboard/StoryInfoForm'
import useAuth from '../../../hooks/useAuth'

export default function DashboardStoryIndex() {
  const [auth, authError] = useAuth()
  const router = useRouter()
  const initialValues: FormValues = {
    title: '',
    subTitle: '',
    category: [],
    charCount: 40,
    activation: false,
    followDiff: 0,
    followDiffUnit: 'minutes',
    isOnlyFollowers: false,
    isOnlySubscribers: false,
  }

  return (
    <>
      <Head>
        <title>사연 생성 | 아이네의 깃털 라디오</title>
      </Head>
      <DashboardFrame auth={auth} authError={authError} currentUrl='/dashboard/story' title='사연 생성'>
        <StoryInfoForm
          initialValues={initialValues}
          isEditPage={false}
          onSubmit={(values, actions) => {
            actions.setSubmitting(true)
            apiFetchPost('/storyinfo/new', values)
              .then((res) => res.json())
              .then((res) => {
                if (res.ok) {
                  router.push(`/dashboard/story/${res.id}`)
                } else {
                  alert(`[${res.error}] 오류가 발생했어요`)
                }
              })
              .catch((err) => {
                console.error(err)
                alert('사연을 생성하던 도중 문제가 생겼어요.\n나중에 다시 시도해주세요.')
                actions.setSubmitting(false)
              })
          }}
        />
      </DashboardFrame>
    </>
  )
}
