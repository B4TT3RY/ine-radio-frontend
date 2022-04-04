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
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

// TODO: /storyinfo/:id:/validate 사용

export default function Index() {
  const [fetchResponse, setFetchResponse] = useState<FetchResponse | undefined>(undefined)
  const { data: auth, error: authError } = useSWR<AuthResponse, FetcherError>('/auth', apiFetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
  })
  const { data: storyInfo, error: storyInfoError } = useSWR<StoryInfoResponse, FetcherError>('/storyinfo', apiFetcher, {
    refreshInterval: 30000,
  })
  const { data: storyInfoValidate, error: storyInfoValidateError } = useSWR<{ ok: boolean }, FetcherError>(
    // `/storyinfo/${storyInfo?.id}/validate`,
    null,
    apiFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  )

  useEffect(() => {
    document.querySelector('html')?.classList.remove('bg-gray-200')
    document.querySelector('html')?.classList.add('bg-purple-200', 'dark:bg-slate-900')
  }, [])

  if (authError && authError.code !== 401) {
    return <Error statusCode={authError.code} />
  }

  if (storyInfoError) {
    return <Error statusCode={storyInfoError.code} />
  }

  const sectionElement = createSection({
    auth,
    authError,
    storyInfo,
    storyInfoError,
    storyInfoValidate,
    storyInfoValidateError,
    fetchResponse,
    setFetchResponse,
  })

  return (
    <>
      <Head>
        <title>홈 | 아이네의 깃털 라디오</title>
        <meta name='theme-color' content='#E9D5FF' media='(prefers-color-scheme: light)' />
        <meta name='theme-color' content='#0F172A' media='(prefers-color-scheme: dark)' />
      </Head>
      <div className='h-screen-safe mb-3 sm:mb-0'>
        <div className='flex justify-end gap-4 p-3 sm:absolute sm:top-0 sm:right-0'>
          {authError && authError.code == 401 && <LoginButton />}
          {auth && !authError && auth.role != Role.USER && <DashboardButton />}
          {auth && !authError && <LogoutButton />}
        </div>
        <div className='flex flex-col items-center justify-center gap-6 h-full sm:h-screen-safe'>
          <header className='flex justify-center select-none'>
            <Image loader={({ src }) => src} src={logoPicture} alt='아이네 라디오 로고' draggable={false} unoptimized />
          </header>
          <section className='flex flex-col items-center justify-center gap-2 w-11/12 md:w-10/12 lg:w-10/12 xl:w-8/12 rounded-2xl p-4 bg-white shadow-lg dark:bg-slate-800'>
            {sectionElement}
          </section>
        </div>
      </div>
      <Script src='/js/channelio.js' />
    </>
  )
}

const createSection = ({
  auth,
  authError,
  storyInfo,
  storyInfoError,
  storyInfoValidate,
  storyInfoValidateError,
  fetchResponse,
  setFetchResponse,
}: {
  auth?: AuthResponse
  authError?: FetcherError
  storyInfo?: StoryInfoResponse
  storyInfoError?: FetcherError
  storyInfoValidate?: { ok: boolean }
  storyInfoValidateError?: FetcherError
  fetchResponse?: FetchResponse
  setFetchResponse: Dispatch<SetStateAction<FetchResponse | undefined>>
}) => {
  if (fetchResponse) {
    return <SectionCard type={fetchResponse.iconType} title={fetchResponse.title} subTitle={fetchResponse.subTitle} />
  }

  if (storyInfoError && storyInfoError.body.error == 'STORY_NOT_FOUND') {
    return <SectionCard type='warning' title='지금은 사연을 받고 있지 않아요' subTitle='다음에 다시 도전해주세요!' />
  }

  if (storyInfoError && storyInfoError.body.error != 'STORY_NOT_FOUND') {
    return (
      <SectionCard type='error' title='사연을 불러오는 도중 문제가 생겼어요.' subTitle='다음에 다시 시도해주세요.' />
    )
  }

  if (!storyInfo) {
    return <SectionCard type='loading' title='사연 정보를 불러오고 있어요.' subTitle='잠시만 기다려주세요...' />
  }

  if (authError && authError.code == 401) {
    return (
      <SectionCard type='warning' title='사연을 보내려면 로그인을 해야해요'>
        <LoginButton />
      </SectionCard>
    )
  }

  if (!auth) {
    return <SectionCard type='loading' title='계정 정보를 불러오고 있어요.' subTitle='잠시만 기다려주세요...' />
  }

  if (storyInfo.currentSubmitCount >= storyInfo.maxSubmitCount) {
    return (
      <SectionCard title={storyInfo.title} subTitle={storyInfo.subTitle}>
        <SectionCard type='error' title={`사연은 ${storyInfo.maxSubmitCount}개까지만 보낼 수 있어요.`} />
      </SectionCard>
    )
  }

  return (
    <SectionCard title={storyInfo.title} subTitle={storyInfo.subTitle}>
      <StoryForm
        storyInfo={storyInfo}
        characterCount={storyInfo.charCount}
        onlyFollowers={storyInfo.onlyFollowers}
        onlySubscribers={storyInfo.onlySubscribers}
        onFetchResponse={(res) => {
          setFetchResponse(res)
        }}
      />
    </SectionCard>
  )
}
