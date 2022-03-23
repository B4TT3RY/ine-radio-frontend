import Head from 'next/head'
import Script from 'next/script'
import GotoBackButton from '../components/button/GotoBackButton'
import GotoHomeButton from '../components/button/GotoHomeButton'
import SectionCard from '../components/SectionCard'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 | 아이네의 깃털 라디오</title>
        <meta name='theme-color' content='#E9D5FF' media='(prefers-color-scheme: light)' />
        <meta name='theme-color' content='#0F172A' media='(prefers-color-scheme: dark)' />
      </Head>
      <div className='bg-purple-200 dark:bg-slate-900 flex flex-col items-center justify-center gap-6 w-screen h-screen max-h-ios p-ios'>
        <section className='flex flex-col items-center gap-2 w-10/12 md:w-8/12 xl:w-6/12 rounded-2xl p-4 bg-white shadow-lg dark:bg-slate-800'>
          <SectionCard type='error' title='404 Not Found' subTitle='존재하지 않는 페이지에요.'>
            <div className='flex gap-3'>
              <GotoBackButton />
              <GotoHomeButton />
            </div>
          </SectionCard>
        </section>
      </div>
      <Script src='/js/channelio.js' />
    </>
  )
}
