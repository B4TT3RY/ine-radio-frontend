import Badge from '../Badge'
import dayjs from 'dayjs'
import { StoryInfoListResponse } from '../../api'
import Link from 'next/link'

interface Props {
  storyInfo: StoryInfoListResponse
}

export default function StoryInfo({ storyInfo }: Props) {
  const activationClass = storyInfo.activation ? ' border-2 border-lime-500' : ''

  return (
    <Link href={`/dashboard/story/${storyInfo.id}`}>
      <a className={`flex justify-between items-center shadow bg-white px-4 py-3 rounded-2xl${activationClass}`}>
        <div className='flex flex-col min-w-0 max-w-md'>
          <h1 className='font-bold text-2xl truncate'>{storyInfo.title}</h1>
          <p className='font-normal text-base truncate'>
            <span className='font-semibold'>{dayjs(storyInfo.createdAt).format('YYYY년 M월 D일 HH시 mm분')}</span> 생성
          </p>
        </div>
        <div className='flex flex-col gap-1 shrink-0 items-end'>
          <div className='flex gap-1'>
            <Badge color={storyInfo.onlyFollowers ? 'lime-500' : 'red-500'}>팔로워 전용</Badge>
            <Badge color={storyInfo.onlySubscribers ? 'lime-500' : 'red-500'}>구독자 전용</Badge>
          </div>
          <div className='flex gap-1'>
            <Badge>최대 ${storyInfo.maxSubmitCount}개 제출 가능</Badge>
          </div>
        </div>
      </a>
    </Link>
  )
}
