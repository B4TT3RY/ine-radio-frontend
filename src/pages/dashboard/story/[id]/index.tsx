import { HeartIcon } from '@heroicons/react/solid'
import dayjs from 'dayjs'
import Error from 'next/error'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import useSWR from 'swr'
import { apiFetcher, FetcherError, StoryInfoIdResponse } from '../../../../api'
import DashboardFrame from '../../../../components/dashboard/DashboardFrame'
import useAuth from '../../../../hooks/useAuth'

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

  return (
    <>
      <Head>
        <title>{storyInfoId?.storyinfo.title ?? '로딩 중'} | 아이네의 깃털 라디오</title>
      </Head>
      <DashboardFrame
        auth={auth}
        authError={authError}
        currentUrl='/dashboard/story'
        title={storyInfoId?.storyinfo.title}
        subTitle={`${dayjs(storyInfoId?.storyinfo.createdAt).format('YYYY년 M월 D일 HH시 mm분')} 생성`}
      >
        {/* TODO: 사연 정보 수정 버튼 추가 */}
        {/* TODO: 입력 필드 추가 */}
        <TableVirtuoso
          style={{ height: undefined }}
          className='h-full shadow rounded-2xl bg-gray-50'
          // TODO: regex 추가
          // data={regex ? stories.filter((s) => regex.test(s.content)) : stories}
          data={storyInfoId?.stories}
          components={{
            Table: (props) => <table {...props} className='table-fixed w-full divide-y divide-gray-300' />,
            // eslint-disable-next-line react/display-name
            TableHead: React.forwardRef((props, ref) => <thead {...props} ref={ref as any} className='bg-gray-50' />),
            // eslint-disable-next-line react/display-name
            TableBody: React.forwardRef((props, ref) => (
              <tbody {...props} ref={ref as any} className='bg-white divide-y divide-gray-300' />
            )),
            TableRow: (props) => <tr {...props} className='hover:bg-gray-100' style={{ wordBreak: 'keep-all' }} />,
          }}
          fixedHeaderContent={() => (
            <tr>
              <th className='text-left px-4 py-2'>사연</th>
              <th className='py-2 w-24 sm:w-36'>접수일자</th>
              <th className='py-2 w-20'>숨기기</th>
            </tr>
          )}
          itemContent={(_, story) => (
            <>
              <td className='flex items-center gap-2 px-4 py-4 font-medium break-all'>
                <HeartIcon
                  className={`flex-none h-6 w-6 cursor-pointer hover:text-red-300 ${
                    story.favorite ? 'text-red-500' : 'text-gray-300 '
                  }`}
                  onClick={() => {
                    // TODO: 사연 좋아요 구현
                  }}
                />
                {story.content}
              </td>
              <td className='py-4 font-medium text-center select-none'>
                {dayjs(story.createdAt).format('YYYY-MM-DD HH:mm')}
              </td>
              <td
                className='py-4 text-red-500 font-medium text-center cursor-pointer select-none'
                onClick={() => {
                  const answer = confirm(
                    `"${
                      story.content.length > 5 ? `${story.content.substring(0, 5)}...` : story.content
                    }" 사연을 숨기시겠어요?\n한번 숨기면 다시 볼 수 없어요.`
                  )
                  if (!answer) {
                    return
                  }
                  // TODO: 사연 숨기기 구현
                  alert(`[${story.id}] 사연을 숨겼어요.`)
                }}
              >
                숨기기
              </td>
            </>
          )}
        />
      </DashboardFrame>
    </>
  )
}
