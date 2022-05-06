import dayjs from 'dayjs'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import useSWR from 'swr'
import { apiFetcher, FetcherError, StoryDetailResponse } from '../../../api'
import { classNames } from '../../../utils'

export default function DashboardDetailViewView() {
  const router = useRouter()
  const id = router.query.id

  const { data: storyDetail, error: storyDetailError } = useSWR<StoryDetailResponse, FetcherError>(
    id ? `/storyDetail/${id}` : null,
    apiFetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  )

  useEffect(() => {
    document.querySelector('html')?.classList.add('bg-gray-200')
  }, [])

  useEffect(() => {
    if (storyDetailError) {
      alert(`[${storyDetailError.body.error}] ${storyDetailError.body.message}`)
      window.close()
    }
  }, [storyDetailError])

  const Field = ({ title, value, textArea }: { title: string; value?: string | number; textArea?: boolean }) => (
    <div>
      <label className='text-lg select-none'>{title}</label>
      {textArea && (
        <textarea
          rows={6}
          disabled={true}
          className={classNames('resize-none w-full text-base p-3 shadow-sm', 'border border-gray-300 rounded-2xl')}
        >
          {value}
        </textarea>
      )}
      {!textArea && (
        <input
          type='text'
          defaultValue={value}
          disabled={true}
          className={classNames(
            'text-base px-3 py-2 transition-all shadow-sm rounded-2xl w-full',
            'focus:ring-purple-500 focus:border-purple-500 border border-gray-300'
          )}
        />
      )}
    </div>
  )

  return (
    <>
      <Head>
        <title>{id}번 부검 | 아이네의 깃털 라디오</title>
      </Head>
      <div className='flex flex-col gap-3 p-3'>
        <Field title='사연 아이디' value={storyDetail?.id} />
        <Field title='작성자 트위치 아이디' value={storyDetail?.login} />
        <Field title='작성자 트위치 닉네임' value={storyDetail?.displayName} />
        <Field
          title='작성자 트위치 밴 여부'
          value={storyDetail?.isBanned === undefined ? '확인 안됨' : storyDetail?.isBanned ? 'O' : 'X'}
        />
        <Field title='사연 카테고리' value={storyDetail?.category} />
        <Field title='사연 작성 일자' value={dayjs(storyDetail?.createdAt).format('YYYY-MM-DD HH:mm:ss')} />
        <Field title='사연 내용' value={storyDetail?.content} textArea={true} />
        <CopyToClipboard
          text={`아이디: \`${storyDetail?.login}\`, 닉네임: \`${storyDetail?.displayName}\``}
          onCopy={() => alert('복사되었어요.')}
        >
          <button
            type='submit'
            className={classNames(
              'text-xl select-none text-white transition-all shadow-lg rounded-2xl b-0 px-3 py-2 whitespace-nowrap',
              'bg-purple-500 shadow-purple-500/50 hover:bg-purple-600 hover:shadow-purple-600/50'
            )}
          >
            복사
          </button>
        </CopyToClipboard>
      </div>
    </>
  )
}
