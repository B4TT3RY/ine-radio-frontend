import { HeartIcon } from '@heroicons/react/solid'
import dayjs from 'dayjs'
import { getRegExp } from 'korean-regexp'
import Error from 'next/error'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import useSWR, { useSWRConfig } from 'swr'
import { apiFetchDownload, apiFetcher, apiFetchPost, FetcherError, StoryInfoIdResponse } from '../../../../api'
import Button from '../../../../components/button/Button'
import DashboardFrame from '../../../../components/dashboard/DashboardFrame'
import useAuth from '../../../../hooks/useAuth'

export default function DashboardStoryById() {
  const { mutate } = useSWRConfig()

  const [auth, authError] = useAuth()
  const [regex, setRegex] = useState<RegExp | undefined>()

  const router = useRouter()
  const { id } = router.query

  const { data: storyInfoId, error: storyInfoIdError } = useSWR<StoryInfoIdResponse, FetcherError>(
    `/storyinfo/${id}`,
    apiFetcher,
    {
      refreshInterval: 30000,
    }
  )

  const [filteredStories, setFilteredStories] = useState<
    | {
        id: number
        content: string
        favorite: boolean
        createdAt: string
      }[]
    | undefined
  >(storyInfoId?.stories)

  useEffect(() => {
    if (regex) {
      setFilteredStories(storyInfoId?.stories.filter((s) => regex.test(s.content)))
    } else {
      setFilteredStories(storyInfoId?.stories)
    }
  }, [regex, storyInfoId?.stories])

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
        subTitle={
          storyInfoId?.storyinfo.createdAt
            ? `${dayjs(storyInfoId?.storyinfo.createdAt).format('YYYY년 M월 D일 HH시 mm분')}  생성`
            : undefined
        }
      >
        <div className='flex justify-end gap-3 mb-3'>
          <Button>
            <Link href={`/dashboard/story/${id}/edit`}>
              <a>사연 수정</a>
            </Link>
          </Button>
          <Button
            color='green-600'
            hoverColor='green-700'
            onClick={() => {
              apiFetchDownload(`/storyinfo/${id}/download`, `${storyInfoId?.storyinfo.title ?? id}.csv`)
            }}
          >
            엑셀(csv) 다운로드
          </Button>
        </div>
        <input
          type='search'
          name='search'
          onChange={(e) => setRegex(getRegExp(e.target.value, { initialSearch: true }))}
          placeholder='검색할 사연을 입력해주세요'
          className='text-base p-3 w-full transition-all shadow-sm focus:ring-purple-500 focus:border-purple-500 border border-gray-300 rounded-xl mb-4'
        />
        <TableVirtuoso
          style={{ height: undefined }}
          className='h-full shadow rounded-2xl bg-gray-50'
          data={filteredStories}
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
              <td
                className='flex items-center gap-2 px-4 py-4 font-medium keep-all'
                style={{ overflowWrap: 'anywhere' }}
              >
                <HeartIcon
                  className={`flex-none h-6 w-6 cursor-pointer hover:text-red-300 ${
                    story.favorite ? 'text-red-500' : 'text-gray-300 '
                  }`}
                  onClick={() => {
                    apiFetchPost(`/storyinfo/${storyInfoId?.storyinfo.id}/favorite`, {
                      storyId: story.id,
                      favorite: !story.favorite,
                    })
                      .then((res) => res.json())
                      .then((res) => {
                        if (res.ok) {
                          setFilteredStories((prev) => {
                            return prev?.map((s) => {
                              if (s.id === story.id) {
                                s.favorite = !s.favorite
                              }
                              return s
                            })
                          })
                        } else {
                          alert(`[${res.error}] 오류가 발생했습니다${res.message ? `:\n${res.message}` : '.'}`)
                        }
                      })
                      .catch((err) => {
                        alert(`오류가 발생했습니다.\n${err}`)
                      })
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
                  apiFetchPost(`/storyinfo/${storyInfoId?.storyinfo.id}/hide`, {
                    storyId: story.id,
                  })
                    .then((res) => res.json())
                    .then((res) => {
                      if (res.ok) {
                        mutate(`/storyinfo/${id}`)
                        alert(`[${story.id}] 사연을 숨겼어요.`)
                      } else {
                        alert(`[${res.error}] 오류가 발생했습니다${res.message ? `:\n${res.message}` : '.'}`)
                      }
                    })
                    .catch((err) => {
                      alert(`오류가 발생했습니다.\n${err}`)
                    })
                }}
              >
                숨기기
              </td>
            </>
          )}
        />
        <div className='h-4'></div>
      </DashboardFrame>
    </>
  )
}

export const getStaticPaths = () => ({ paths: ['/dashboard/story/[id]'], fallback: true })
