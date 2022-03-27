import { XIcon } from '@heroicons/react/outline'
import Image, { ImageLoaderProps } from 'next/image'
import { AuthResponse, Role } from '../../api'

interface Props {
  className?: string
  user?: AuthResponse
}

const loader = ({ src }: ImageLoaderProps) => {
  return src
}

export default function SimpleUserProfile({ className, user }: Props) {
  return (
    <div className={`flex justify-between shadow bg-white px-4 py-3 rounded-2xl${className ? ` ${className}` : ''}`}>
      <div className='flex items-center'>
        <div className='relative h-10 w-10 rounded-full scale-105'>
          {user && (
            <Image
              loader={loader}
              src={user.profileImage}
              alt='프로필'
              layout='fill'
              objectFit='cover'
              className='object-contain rounded-full scale-95'
              unoptimized
            />
          )}
        </div>
        <div className='flex flex-col ml-4'>
          <span className='text-lg font-semibold leading-none'>{user?.displayName}</span>
          <span className='text-base leading-none mt-1'>{user?.login}</span>
        </div>
      </div>
      {user?.role == Role.STAFF && (
        <div
          className='flex items-center justify-center cursor-pointer'
          onClick={async () => {
            const answer = confirm(`${user.displayName}(${user.login})님의 스탭 권한을 제거하시겠어요?`)
            if (!answer) {
              return
            }
          }}
        >
          <XIcon className='text-red-600 w-10 h-10' />
        </div>
      )}
    </div>
  )
}
