import { Field, Form, Formik } from 'formik'
import { KeyboardEvent, useEffect } from 'react'
import { apiFetchPost, StoryInfoResponse } from '../api'
import usePreventLeave from '../hooks/usePreventLeave'
import { classNames, getErrorMessage, unitToKorean } from '../utils'
import Badge from './Badge'

interface Props {
  storyInfo: StoryInfoResponse
  characterCount: number
  onlyFollowers: boolean
  onlySubscribers: boolean
  onFetchResponse: (fetchResponse: FetchResponse) => void
}

interface FormValues {
  storyinfoId: string
  category: string
  content: string
}

export interface FetchResponse {
  iconType: 'info' | 'success' | 'warning' | 'error' | 'loading' | undefined
  title: string
  subTitle?: string
}

export default function StoryForm({
  storyInfo,
  characterCount,
  onlyFollowers,
  onlySubscribers,
  onFetchResponse,
}: Props) {
  const { enablePrevent, disablePrevent } = usePreventLeave()

  useEffect(() => {
    enablePrevent()

    return () => {
      disablePrevent()
    }
  }, [enablePrevent, disablePrevent])

  const initialValues: FormValues = {
    storyinfoId: storyInfo.id,
    category: '',
    content: '',
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          const isSubmit = confirm('사연을 보내면 수정하거나 삭제할 수 없어요.\n사연을 보내시겠어요?')
          if (isSubmit) {
            disablePrevent()
            actions.setSubmitting(true)
            apiFetchPost('/story/submit', values)
              .then((res) => res.json())
              .then((res) => {
                if (res.ok) {
                  onFetchResponse({
                    iconType: 'success',
                    title: '사연이 성공적으로 접수되었어요!',
                  })
                } else {
                  const [title, subTitle] = getErrorMessage(res.error, res.message)

                  onFetchResponse({
                    iconType: 'error',
                    title,
                    subTitle: subTitle != '' ? subTitle : undefined,
                  })
                }
              })
              .catch((err) => {
                onFetchResponse({
                  iconType: 'error',
                  title: '제출을 시도하던 도중 문제가 생겼어요.',
                  subTitle: '다시 시도하거나 채팅으로 문의 해 주세요.',
                })
                actions.setSubmitting(false)
              })
          } else {
            enablePrevent()
            actions.setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting, values }) => (
          <Form className='w-full'>
            <fieldset disabled={isSubmitting} className='w-full gap-2 flex flex-wrap items-center justify-between'>
              <Field
                as='select'
                name='category'
                className={classNames(
                  'text-base px-3 py-2 w-full transition-all shadow-sm focus:ring-purple-500 focus:border-purple-500 border border-gray-300 rounded-xl',
                  'dark:bg-slate-700 dark:text-white',
                  'disabled:bg-gray-200 disabled:text-gray-600 dark:disabled:bg-slate-500 dark:disabled:text-gray-400'
                )}
                required
                value={values.category}
              >
                <option value='' className='hidden' disabled>
                  카테고리를 선택하세요
                </option>
                {storyInfo.category.split(',').map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Field>
              <Field
                as='textarea'
                name='content'
                placeholder='사연을 작성해주세요'
                rows={3}
                onKeyPress={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                  }
                }}
                className={classNames(
                  'resize-none w-full text-base p-3 transition-all shadow-sm focus:ring-purple-500 focus:border-purple-500 border',
                  'border-gray-300 rounded-2xl dark:bg-slate-700 dark:text-white dark:placeholder:text-slate-400',
                  'disabled:bg-gray-200 disabled:text-gray-500 dark:disabled:bg-slate-500 dark:disabled:text-gray-300'
                )}
              />
              <div className='flex items-center gap-2 select-none'>
                <Badge>{storyInfo.maxSubmitCount - storyInfo.currentSubmitCount}개 제출 가능</Badge>
                {onlyFollowers && (
                  <Badge>
                    팔로워 전용
                    {storyInfo.followDiff > 0 && ` (+${storyInfo.followDiff}${unitToKorean(storyInfo.followDiffUnit)})`}
                  </Badge>
                )}
                {onlySubscribers && <Badge>구독자 전용</Badge>}
              </div>
              <div className='flex items-center gap-2 select-none'>
                <span
                  className={`${
                    values.content.length > characterCount ? 'text-rose-600' : 'text-black dark:text-white'
                  }`}
                >
                  {values.content.length}/{characterCount}자
                </span>
                <button
                  type='submit'
                  disabled={
                    values.category.length === 0 ||
                    values.content.length === 0 ||
                    values.content.length > characterCount
                  }
                  className='text-lg text-white rounded-2xl b-0 p-3 transition-all shadow-lg bg-purple-500 shadow-purple-500/50 hover:bg-purple-600 hover:shadow-purple-600/50 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-gray-200/50 dark:disabled:bg-gray-700 dark:disabled:text-gray-400 dark:disabled:shadow-gray-700/50'
                >
                  {isSubmitting ? '사연 보내는 중...' : '사연 보내기'}
                </button>
              </div>
            </fieldset>
          </Form>
        )}
      </Formik>
    </>
  )
}
