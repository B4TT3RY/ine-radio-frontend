import '../styles/global.css'
import '../styles/suit.css'
import '../styles/tailwind.css'
import 'nprogress/nprogress.css'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

import type { AppProps } from 'next/app'

import Router from 'next/router'
import NProgress from 'nprogress'
import { useEffect } from 'react'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.querySelector('#__next')?.classList.add('h-screen-safe')
    return () => {
      document.querySelector('#__next')?.classList.remove('h-screen-safe')
    }
  }, [])
  return <Component {...pageProps} />
}
