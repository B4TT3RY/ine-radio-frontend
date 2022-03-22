import Image from 'next/image'
import DashboardButton from '../components/button/DashboardButton'
import LoginButton from '../components/button/LoginButton'
import LogoutButton from '../components/button/LogoutButton'
import SectionCard from '../components/SectionCard'
import logoPicture from '../assets/img/logo.png'
import Head from 'next/head'
import { apiFetcher, AuthResponse, FetcherError, Role, StoryInfoResponse } from '../api'
import useSWR from 'swr'
import StoryForm from '../components/StoryForm'
import Error from 'next/error'
import Script from 'next/script'
import { useEffect } from 'react'

export default function Index() {
  const { data: auth, error: authError } = useSWR<AuthResponse, FetcherError>('/auth', apiFetcher, {
    revalidateOnFocus: false,
  })
  const { data: storyInfo, error: storyInfoError } = useSWR<StoryInfoResponse, FetcherError>('/storyinfo', apiFetcher, {
    refreshInterval: 30000,
  })

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

  const sectionElement = createSection({ auth, authError, storyInfo, storyInfoError })

  return (
    <>
      <Head>
        <title>홈 | 아이네의 깃털 라디오</title>
        <meta name='theme-color' content='#E9D5FF' media='(prefers-color-scheme: light)' />
        <meta name='theme-color' content='#0F172A' media='(prefers-color-scheme: dark)' />
      </Head>
      <div className='flex flex-col items-center justify-center gap-6 w-screen h-screen max-h-ios'>
        <div className='flex gap-4 absolute top-2 right-2'>
          {!auth && authError && <LoginButton />}
          {auth && !authError && auth.role !== Role.STAFF && <DashboardButton />}
          {auth && !authError && <LogoutButton />}
        </div>
        <header className='flex justify-center select-none'>
          <Image loader={({ src }) => src} src={logoPicture} alt='아이네 라디오 로고' draggable={false} />
        </header>
        <section className='grid place-items-center select-none gap-2 w-10/12 md:w-8/12 xl:w-6/12 rounded-2xl p-4 bg-white shadow-lg dark:bg-slate-800'>
          {sectionElement}
        </section>
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
}: {
  auth?: AuthResponse
  authError?: FetcherError
  storyInfo?: StoryInfoResponse
  storyInfoError?: FetcherError
}) => {
  // if (actionData?.success) {
  //   return (
  //     <SectionCard title={storyInfo?.title} subTitle={storyInfo?.subTitle}>
  //       <SectionCard type='info' title='사연이 성공적으로 접수되었어요!' />
  //     </SectionCard>
  //   )
  // }

  // if (actionData?.error) {
  //   return (
  //     <SectionCard title={storyInfo?.title} subTitle={storyInfo?.subTitle}>
  //       <SectionCard type='error' title={actionData.error} />
  //     </SectionCard>
  //   )
  // }

  if (storyInfoError && storyInfoError.body.error == 'STORY_NOT_FOUND') {
    return <SectionCard type='warning' title='지금은 사연을 받고 있지 않아요' subTitle='다음에 다시 도전해주세요!' />
  }

  if (!storyInfo) {
    return <SectionCard type='loading' title='사연 정보를 불러오고 있어요.' subTitle='잠시만 기다려주세요...' />
  }

  if (authError?.code == 401) {
    return (
      <SectionCard type='warning' title='사연을 보내려면 로그인을 해야해요'>
        <LoginButton />
      </SectionCard>
    )
  }

  // if (followErrorMessage) {
  //   return (
  //     <SectionCard title={storyInfo.title} subTitle={storyInfo.subTitle}>
  //       <SectionCard type='error' title={followErrorMessage.title} subTitle={followErrorMessage.subTitle} />
  //     </SectionCard>
  //   )
  // }

  return (
    <SectionCard title={storyInfo.title} subTitle={storyInfo.subTitle}>
      <StoryForm
        storyId={storyInfo.id}
        characterCount={storyInfo.charCount}
        onlyFollowers={storyInfo.onlyFollowers}
        onlySubscribers={storyInfo.onlySubscribers}
      />
    </SectionCard>
  )
}