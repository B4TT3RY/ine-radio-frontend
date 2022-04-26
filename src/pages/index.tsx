import Image from 'next/image'
import DashboardButton from '../components/button/DashboardButton'
import LoginButton from '../components/button/LoginButton'
import LogoutButton from '../components/button/LogoutButton'
import SectionCard from '../components/SectionCard'
import logoPicture from '../assets/img/logo.png'
import Head from 'next/head'
import { apiFetcher, AuthResponse, FetcherError, Role, StoryInfoResponse } from '../api'
import useSWR from 'swr'
import StoryForm, { FetchResponse } from '../components/StoryForm'
import Error from 'next/error'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { classNames } from '../utils'
import { useRouter } from 'next/router'

// TODO: /storyinfo/:id:/validate 사용

export default function Index() {
  const router = useRouter()
  const [fetchResponse, setFetchResponse] = useState<FetchResponse | undefined>(undefined)
  const [isLoadingSlow, setLoadingSlow] = useState(false)
  const { data: auth, error: authError } = useSWR<AuthResponse, FetcherError>('/auth', apiFetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    onLoadingSlow: () => {
      setLoadingSlow(true)
    },
  })
  const { data: storyInfo, error: storyInfoError } = useSWR<StoryInfoResponse, FetcherError>('/storyinfo', apiFetcher, {
    refreshInterval: 30000,
    onLoadingSlow: () => {
      setLoadingSlow(true)
    },
  })

  useEffect(() => {
    document.querySelector('html')?.classList.remove('bg-gray-200')
    document.querySelector('html')?.classList.add('bg-purple-200', 'dark:bg-slate-900')
  }, [])

  const sectionElement = () => {
    if (fetchResponse) {
      return (
        <SectionCard type={fetchResponse.iconType} title={fetchResponse.title} subTitle={fetchResponse.subTitle}>
          <button
            onClick={() => {
              router.reload()
            }}
            className={classNames(
              'text-xl text-white cursor-pointer transition-all shadow-lg rounded-2xl b-0 p-3',
              'bg-purple-500 shadow-purple-500/50 hover:bg-purple-600 hover:shadow-purple-600/50'
            )}
          >
            홈으로
          </button>
        </SectionCard>
      )
    }

    if (storyInfoError && storyInfoError.code === undefined && storyInfoError.body === undefined) {
      return <SectionCard type='error' title='서버에 연결할 수 없어요.' subTitle='나중에 다시 시도해 주세요.' />
    }

    if (storyInfoError && storyInfoError.body.error == 'STORY_NOT_FOUND') {
      return <SectionCard type='warning' title='지금은 사연을 받고 있지 않아요.' subTitle='다음에 다시 도전해주세요.' />
    }

    if (storyInfoError && storyInfoError.body.error != 'STORY_NOT_FOUND') {
      return (
        <SectionCard type='error' title='사연을 불러오는 도중 문제가 생겼어요.' subTitle='다음에 다시 시도해주세요.' />
      )
    }

    if (!storyInfo) {
      return (
        <SectionCard
          type='loading'
          title='사연 정보를 불러오고 있어요.'
          subTitle={
            isLoadingSlow ? '로딩이 조금 오래 걸리고 있어요.<br>조금만 더 기다려 주세요...' : '잠시만 기다려주세요...'
          }
        />
      )
    }

    if (authError && authError.code !== 401) {
      return <Error statusCode={authError.code} />
    }

    if (authError && authError.code == 401) {
      return (
        <SectionCard title={storyInfo.title}>
          <SectionCard type='warning' title='사연을 보내려면 로그인을 해야해요'>
            <LoginButton />
          </SectionCard>
        </SectionCard>
      )
    }

    if (!auth) {
      return (
        <SectionCard
          type='loading'
          title='계정 정보를 불러오고 있어요.'
          subTitle={
            isLoadingSlow ? '로딩이 조금 오래 걸리고 있어요.<br>조금만 더 기다려 주세요...' : '잠시만 기다려주세요...'
          }
        />
      )
    }

    // TODO: 카테고리 별 사연 제출 제한 적용
    // if (storyInfo.currentSubmitCount >= storyInfo.maxSubmitCount) {
    //   return (
    //     <SectionCard title={storyInfo.title} subTitle={storyInfo.subTitle}>
    //       <SectionCard type='error' title={`사연은 ${storyInfo.maxSubmitCount}개까지만 보낼 수 있어요.`} />
    //     </SectionCard>
    //   )
    // }

    return (
      <SectionCard title={storyInfo.title} subTitle={storyInfo.subTitle}>
        <StoryForm
          storyInfo={storyInfo}
          onlyFollowers={storyInfo.onlyFollowers}
          onlySubscribers={storyInfo.onlySubscribers}
          onFetchResponse={(res) => {
            setFetchResponse(res)
          }}
        />
      </SectionCard>
    )
  }

  return (
    <>
      <Head>
        <title>홈 | 아이네의 깃털 라디오</title>
        <meta name='theme-color' content='#E9D5FF' media='(prefers-color-scheme: light)' />
        <meta name='theme-color' content='#0F172A' media='(prefers-color-scheme: dark)' />
      </Head>
      <div className='flex flex-col min-h-screen-safe'>
        <div className='flex justify-end gap-4 p-3 lg:absolute lg:top-0 lg:right-0'>
          {authError && authError.code == 401 && <LoginButton />}
          {auth && !authError && auth.role != Role.USER && <DashboardButton />}
          {auth && !authError && <LogoutButton />}
        </div>
        <div className='flex flex-1 flex-col items-center justify-center gap-6'>
          <header className='flex justify-center select-none'>
            <Image loader={({ src }) => src} src={logoPicture} alt='라디오 로고' draggable={false} unoptimized />
          </header>
          <section
            className={classNames(
              'flex flex-col items-center justify-center gap-2 w-11/12 md:w-10/12 lg:w-10/12 xl:w-8/12',
              'rounded-2xl p-4 bg-white shadow-lg dark:bg-slate-800'
            )}
          >
            {sectionElement()}
          </section>
        </div>
        <div className='h-3 lg:h-0 w-screen'></div>
      </div>
      <Script src='/js/channelio.js' />
    </>
  )
}
