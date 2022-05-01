import dayjs from 'dayjs'
import Link from 'next/link'
import { useMediaQuery } from 'react-responsive'
import { StoryInfoListResponse } from '../../api'
import Badge from '../Badge'

interface Props {
  storyInfo: StoryInfoListResponse
}

export default function StoryInfo({ storyInfo }: Props) {
  const activationClass = storyInfo.activation ? ' border-2 border-lime-500' : ''

  const isSm = useMediaQuery({
    query: '(min-width: 640px)',
  })

  return (
    <Link href={`/dashboard/story/${storyInfo.id}`}>
      <a className={`flex justify-between items-center shadow bg-white px-4 py-3 rounded-2xl${activationClass}`}>
        <div className='flex flex-col min-w-0 max-w-md'>
          <h1 className='font-bold text-xl sm:text-2xl truncate'>{storyInfo.title}</h1>
          <p className='font-normal text-base truncate'>
            <span className='font-semibold'>{dayjs(storyInfo.createdAt).format('YYYY년 M월 D일 HH시 mm분')}</span> 생성
          </p>
        </div>
        <div className='flex flex-col gap-1 shrink-0 items-end'>
          <Badge color={storyInfo.onlyFollowers ? 'lime-500' : 'red-500'}>팔로워 {isSm ? '전용' : ''}</Badge>
          <Badge color={storyInfo.onlySubscribers ? 'lime-500' : 'red-500'}>구독자 {isSm ? '전용' : ''}</Badge>
        </div>
      </a>
    </Link>
  )
}
