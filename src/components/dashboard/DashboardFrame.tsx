import { Disclosure, Transition } from '@headlessui/react'
import { XIcon, MenuIcon } from '@heroicons/react/outline'
import Image, { ImageLoaderProps } from 'next/image'
import { AuthResponse, FetcherError, Role } from '../../api'
import Link from 'next/link'
import logoPicture from '../../assets/img/logo.png'
import Error from 'next/error'
import { useEffect } from 'react'

const navigation = [
  { name: '사연 관리', href: '/dashboard/story', role: [Role.ADMIN, Role.STREAMER, Role.STAFF] },
  { name: '권한 관리', href: '/dashboard/permission', role: [Role.ADMIN, Role.STREAMER] },
]

interface Props {
  auth?: AuthResponse
  authError?: FetcherError
  title?: string
  subTitle?: string
  currentUrl: string
  children?: React.ReactNode
}

const loader = ({ src }: ImageLoaderProps) => {
  return src
}

export default function DashboardFrame({ children, auth, authError, title, subTitle, currentUrl }: Props) {
  useEffect(() => {
    document.querySelector('html')?.classList.remove('bg-purple-200', 'dark:bg-slate-900')
    document.querySelector('html')?.classList.add('bg-gray-200')
  }, [])

  if (authError) {
    return <Error statusCode={authError.code} />
  }

  if (auth?.role == Role.USER) {
    return <Error statusCode={401} />
  }

  return (
    <>
      <div className='flex flex-col h-screen-safe'>
        <Disclosure as='nav' className='bg-gray-800 z-10'>
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
                            unoptimized
                          />
                        </a>
                      </Link>
                    </div>
                    <div className='hidden md:block'>
                      <div className='ml-10 flex items-baseline space-x-4'>
                        {navigation
                          .filter((item) => item.role.includes(auth?.role ?? Role.USER))
                          .map((item) => (
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
                  <div className={`hidden md:block${auth ? '' : ' animate-pulse'}`}>
                    <div className='ml-4 flex items-center md:ml-6'>
                      <div className='relative h-8 w-8 bg-slate-700 rounded-full'>
                        {auth && (
                          <Image
                            loader={loader}
                            src={auth.profileImage}
                            alt='프로필'
                            layout='fill'
                            objectFit='cover'
                            className='object-contain rounded-full'
                            unoptimized
                          />
                        )}
                      </div>

                      <div className='ml-2 flex flex-col'>
                        {auth ? (
                          <>
                            <span className='text-base font-medium leading-none text-white'>{auth.displayName}</span>
                            <span className='text-sm font-medium leading-none text-gray-400'>{auth.login}</span>
                          </>
                        ) : (
                          <div className='flex flex-col gap-2'>
                            <span className='h-2 w-24 rounded bg-slate-700'></span>
                            <span className='h-2 w-20 rounded bg-slate-700'></span>
                          </div>
                        )}
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
              <Disclosure.Panel className='md:hidden'>
                <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                  {navigation
                    .filter((item) => item.role.includes(auth?.role ?? Role.USER))
                    .map((item) => (
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
                      <div className='relative h-8 w-8 bg-slate-700 rounded-full'>
                        {auth && (
                          <Image
                            loader={loader}
                            src={auth.profileImage}
                            alt='프로필'
                            layout='fill'
                            objectFit='cover'
                            className='object-contain rounded-full'
                            unoptimized
                          />
                        )}
                      </div>
                    </div>
                    <div className='ml-3'>
                      <div className='text-base font-medium leading-none text-white'>{auth?.displayName}</div>
                      <div className='text-sm font-medium leading-none text-gray-400'>{auth?.login}</div>
                    </div>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <header className='bg-white shadow z-10'>
          <div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
            {title ? (
              <h1 className='text-2xl font-extrabold text-gray-900'>{title}</h1>
            ) : (
              <p className='animate-pulse h-6 w-64 rounded-3xl bg-slate-200'></p>
            )}

            {subTitle && <span className='text-base font-medium text-gray-800'>{subTitle}</span>}
          </div>
        </header>
        <main className='flex flex-1 overflow-auto'>
          <div className='flex-1 max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>{children}</div>
        </main>
      </div>
    </>
  )
}
