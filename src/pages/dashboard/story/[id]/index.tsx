import { ExclamationCircleIcon } from '@heroicons/react/solid'
import dayjs from 'dayjs'
import { getRegExp } from 'korean-regexp'
import Error from 'next/error'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { TableVirtuoso } from 'react-virtuoso'
import useSWR, { useSWRConfig } from 'swr'
import {
  apiFetcher, apiFetchPost,
  FetcherError,
  Role,
  StoryInfoIdResponse
} from '../../../../api'
import Badge from '../../../../components/Badge'
import Button from '../../../../components/button/Button'
import CsvDownloadDialog from '../../../../components/dashboard/CsvDownloadDialog'
import DashboardFrame from '../../../../components/dashboard/DashboardFrame'
import useAuth from '../../../../hooks/useAuth'
import { classNames } from '../../../../utils'

export default function DashboardStoryById() {
  const { mutate } = useSWRConfig()

  const [auth, authError] = useAuth()
  const [regex, setRegex] = useState<RegExp | undefined>()
  const [category, setCategory] = useState('전체')
  const [csvDownloadDialogIsOpen, setCsvDownloadDialogIsOpen] = useState(false)

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
        category: string
        favorite: boolean
        isBanned: boolean
        createdAt: string
      }[]
    | undefined
  >(storyInfoId?.stories)

  useEffect(() => {
    let stories = storyInfoId?.stories

    if (regex) {
      stories = stories?.filter((s) => regex.test(s.content))
    }

    if (category !== '전체') {
      stories = stories?.filter((s) => s.category === category)
    }

    setFilteredStories(stories)
  }, [category, regex, storyInfoId?.stories])

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
        <div className='flex flex-wrap justify-end gap-3 pb-3'>
          <Button extraClassName='whitespace-nowrap'>
            <Link href={`/dashboard/story/${id}/edit`}>
              <a>사연 수정</a>
            </Link>
          </Button>
          <Button
            color='green-600'
            hoverColor='green-700'
            extraClassName='whitespace-nowrap'
            onClick={() => {
              setCsvDownloadDialogIsOpen(true)
            }}
          >
            csv 다운로드 (기간)
          </Button>
          <CsvDownloadDialog
            storyInfoId={storyInfoId}
            isOpen={csvDownloadDialogIsOpen}
            setIsOpen={() => {
              setCsvDownloadDialogIsOpen(false)
            }}
          />

          <Button
            color='green-600'
            hoverColor='green-700'
            extraClassName='whitespace-nowrap'
            onClick={() => {
              setCsvDownloadDialogIsOpen(true)
            }}
          >
            csv 다운로드 (오프셋)
          </Button>
          <CsvDownloadDialog
            storyInfoId={storyInfoId}
            isOpen={csvDownloadDialogIsOpen}
            setIsOpen={() => {
              setCsvDownloadDialogIsOpen(false)
            }}
          />
        </div>
        <div className='flex gap-3 mb-4'>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className={classNames(
              'text-base px-3 py-2 w-1/3 sm:w-2/12 transition-all shadow-sm',
              'focus:ring-purple-500 focus:border-purple-500 border border-gray-300 rounded-xl'
            )}
          >
            <option value='전체'>전체</option>
            {storyInfoId?.storyinfo.category?.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            type='search'
            name='search'
            onChange={(e) => setRegex(getRegExp(e.target.value, { initialSearch: true }))}
            placeholder='검색할 사연을 입력해주세요'
            className={classNames(
              'text-base p-3 w-10/12 transition-all shadow-sm rounded-xl',
              'focus:ring-purple-500 focus:border-purple-500 border border-gray-300'
            )}
          />
        </div>
        <TableVirtuoso
          style={{ height: undefined }}
          className='h-full shadow rounded-2xl bg-gray-50'
          data={filteredStories}
          components={{
            Table: (props) => <table {...props} className='w-[200vw] md:w-full table-fixed divide-y divide-gray-300' />,
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
              <th className='py-2 w-36'>접수일자</th>
              <th className='py-2 w-20'>숨기기</th>
            </tr>
          )}
          itemContent={(_, story) => (
            <>
              <td
                className={classNames(
                  'flex transition-all items-center gap-2 px-4 py-4 font-medium keep-all',
                  story.isBanned == null ? 'text-gray-400 hover:text-black' : ''
                )}
                style={{ overflowWrap: 'anywhere' }}
              >
                {story.isBanned == null && (
                  <div className='flex-none group'>
                    <ExclamationCircleIcon className='h-6 w-6 text-yellow-400' />
                    <span
                      className={classNames(
                        'select-none invisible group-hover:visible absolute',
                        'bg-slate-700 text-white rounded-md shadow-md px-1.5 py-0.5',
                        'transition-opacity opacity-0 group-hover:opacity-100'
                      )}
                    >
                      밴 여부 확인이 되지 않은 사연이에요.
                    </span>
                  </div>
                )}
                <Badge color='gray-400' extraClassName='whitespace-nowrap' small={true}>
                  {story.category}
                </Badge>

                {story.content}
              </td>
              <td className='py-4 font-medium text-center select-none'>
                {dayjs(story.createdAt).format('YYYY-MM-DD HH:mm')}
              </td>
              <td
                className='py-4 text-red-500 font-medium text-center cursor-pointer select-none'
                onClick={() => {
                  const answer = confirm(
                    `"[${story.id}] ${
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
                        alert(`[${res.error}] 오류가 발생했어요${res.message ? `:\n${res.message}` : '.'}`)
                      }
                    })
                    .catch((err) => {
                      alert(`오류가 발생했어요.\n${err}`)
                    })
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
