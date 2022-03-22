import { Disclosure, Transition } from '@headlessui/react'
import { XIcon, MenuIcon } from '@heroicons/react/outline'
import Image, { ImageLoaderProps } from 'next/image'
import { apiFetcher, AuthResponse, FetcherError, Role } from '../../api'
import Link from 'next/link'
import useSWR, { Fetcher } from 'swr'
import logoPicture from '../../assets/img/logo.png'
import Error from 'next/error'
import { Loader } from '../Loader'
import { useEffect } from 'react'

const navigation = [
  { name: '대시보드', href: '/dashboard' },
  { name: '사연 관리', href: '/dashboard/story' },
  { name: '권한 관리', href: '/dashboard/permission' },
]

interface Props {
  title?: string
  subTitle?: string
  currentUrl: string
  children?: React.ReactNode
}

const loader = ({ src }: ImageLoaderProps) => {
  return src
}

export default function DashboardFrame({ children, title, subTitle, currentUrl }: Props) {
  const { data: auth, error: authError } = useSWR<AuthResponse, FetcherError>('/auth', apiFetcher)

  useEffect(() => {
    document.querySelector('html')?.classList.remove('bg-purple-200', 'dark:bg-slate-900')
    document.querySelector('html')?.classList.add('bg-gray-200')
  }, [])

  if (authError) {
    return <Error statusCode={authError.code} />
  }
  if (!auth) {
    return <Loader show={!auth} />
  }
  if (auth.role === Role.USER) {
    return <Error statusCode={401} />
  }

  return (
    <>
      <div className='min-h-full'>
        <Disclosure as='nav' className='bg-gray-800 fixed w-screen'>
          {({ open }) => (
            <>
              <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex items-center justify-between h-16'>
                  <div className='flex items-center'>
                    <div className='flex shrink-0'>
                      <Link href='/'>
                        <a className='relative h-8 w-24'>
                          <Image
                            loader={({ src }) => src}
                            className='object-contain'
                            src={logoPicture}
                            alt='아이네 라디오 로고'
                            layout='fill'
                          />
                        </a>
                      </Link>
                    </div>
                    <div className='hidden md:block'>
                      <div className='ml-10 flex items-baseline space-x-4'>
                        {navigation.map((item) => (
                          <Link key={item.href} href={item.href}>
                            <a
                              className={`${
                                item.href === currentUrl
                                  ? 'bg-gray-900 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              } px-3 py-2 rounded-md text-sm font-medium`}
                            >
                              {item.name}
                            </a>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className='hidden md:block'>
                    <div className='ml-4 flex items-center md:ml-6'>
                      <div className='relative h-8 w-8'>
                        <Image
                          loader={loader}
                          src={auth.profileImage}
                          alt='프로필'
                          layout='fill'
                          objectFit='cover'
                          className='object-contain rounded-full'
                        />
                      </div>

                      <div className='ml-2 flex flex-col'>
                        <span className='text-base font-medium leading-none text-white'>{auth.displayName}</span>
                        <span className='text-sm font-medium leading-none text-gray-400'>{auth.login}</span>
                      </div>
                    </div>
                  </div>
                  <div className='-mr-2 flex md:hidden'>
                    <Disclosure.Button className='bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'>
                      {open ? (
                        <XIcon className='block h-6 w-6' aria-hidden='true' />
                      ) : (
                        <MenuIcon className='block h-6 w-6' aria-hidden='true' />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
              <Transition
                enter='transition duration-100 ease-out'
                enterFrom='transform scale-95 opacity-0'
                enterTo='transform scale-100 opacity-100'
                leave='transition duration-75 ease-out'
                leaveFrom='transform scale-100 opacity-100'
                leaveTo='transform scale-95 opacity-0'
              >
                <Disclosure.Panel className='md:hidden'>
                  <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                    {navigation.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <a className='block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700'>
                          {item.name}
                        </a>
                      </Link>
                    ))}
                  </div>
                  <div className='pt-4 pb-3 border-t border-gray-700'>
                    <div className='flex items-center px-5'>
                      <div className='flex-shrink-0'>
                        <Image
                          className='h-10 w-10 rounded-full'
                          loader={loader}
                          src={auth.profileImage}
                          alt='프로필'
                        />
                      </div>
                      <div className='ml-3'>
                        <div className='text-base font-medium leading-none text-white'>{auth.displayName}</div>
                        <div className='text-sm font-medium leading-none text-gray-400'>{auth.login}</div>
                      </div>
                    </div>
                  </div>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
        <header className='pt-16 bg-white shadow'>
          <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
            <h1 className='text-3xl font-bold text-gray-900'>{title}</h1>
            {subTitle && <span className='text-base font-medium text-gray-800'>{subTitle}</span>}
          </div>
        </header>
        <main>
          <div className='max-w-7xl mx-auto px-2 py-6 sm:px-6 lg:px-8 flex flex-1 flex-col gap-3 overflow-auto'>
            {children}
          </div>
        </main>
      </div>
    </>
  )
}