import Error from 'next/error'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { apiFetchDelete, apiFetcher, apiFetchPut, FetcherError, Role, StoryInfoIdResponse } from '../../../../api'
import DashboardFrame from '../../../../components/dashboard/DashboardFrame'
import StoryInfoForm, { FormValues } from '../../../../components/dashboard/StoryInfoForm'
import useAuth from '../../../../hooks/useAuth'

export default function DashboardStoryEdit() {
  const [auth, authError] = useAuth()
  const [initialValues, setInitialValues] = useState<FormValues>()
  const router = useRouter()
  const { id } = router.query

  const { data: storyInfoId, error: storyInfoIdError } = useSWR<StoryInfoIdResponse, FetcherError>(
    `/storyinfo/${id}`,
    apiFetcher,
    {
      refreshInterval: 30000,
    }
  )

  useEffect(() => {
    if (storyInfoId) {
      setInitialValues({
        title: storyInfoId.storyinfo.title,
        subTitle: storyInfoId.storyinfo.subTitle,
        charCount: storyInfoId.storyinfo.charCount,
        activation: storyInfoId.storyinfo.activation,
        isOnlyFollowers: storyInfoId.storyinfo.onlyFollowers,
        followDiff: storyInfoId.storyinfo.followDiff,
        followDiffUnit: storyInfoId.storyinfo.followDiffUnit,
        isOnlySubscribers: storyInfoId.storyinfo.onlySubscribers,
        maxSubmitCount: storyInfoId.storyinfo.maxSubmitCount
      })
    }
  }, [storyInfoId])

  if (auth?.role == Role.STAFF) {
    return <Error statusCode={401} />
  }

  if (storyInfoIdError) {
    return <Error statusCode={storyInfoIdError.code} />
  }

  return (
    <>
      <Head>
        <title>사연 수정 | 아이네의 깃털 라디오</title>
      </Head>
      <DashboardFrame auth={auth} authError={authError} currentUrl='/dashboard/story' title='사연 수정'>
        {initialValues && (
          <StoryInfoForm
            initialValues={initialValues}
            isEditPage={true}
            onSubmit={(values, actions) => {
              actions.setSubmitting(true)
              apiFetchPut(`/storyinfo/${id}/edit`, values)
                .then((res) => res.json())
                .then((res) => {
                  if (res.ok) {
                    router.push(`/dashboard/story/${id}`)
                  } else {
                    alert(`[${res.error}] 오류가 발생했어요`)
                  }
                })
                .catch((err) => {
                  console.error(err)
                  alert('사연을 수정하던 도중 문제가 생겼어요.\n나중에 다시 시도해주세요.')
                  actions.setSubmitting(false)
                })
            }}
            onDelete={() => {
              const answer = confirm(
                `삭제한 사연은 복구할 수 없어요.\n사연을 삭제하면 ${storyInfoId?.stories.length}개의 답변도 복구할 수 없어요.\n삭제하시겠어요?`
              )
              if (answer) {
                apiFetchDelete(`/storyinfo/${storyInfoId?.storyinfo.id}/delete`)
                  .then((res) => res.json())
                  .then((res) => {
                    if (res.ok) {
                      router.push('/dashboard/story')
                    } else {
                      alert(`[${res.error}] 오류가 발생했습니다${res.message ? `:\n${res.message}` : '.'}`)
                    }
                  })
                  .catch((err) => {
                    alert(`오류가 발생했습니다.\n${err}`)
                  })
              }
            }}
          />
        )}
      </DashboardFrame>
    </>
  )
}
