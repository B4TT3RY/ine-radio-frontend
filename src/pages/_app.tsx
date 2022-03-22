import '../styles/global.css'
import '../styles/suit.css'
import '../styles/tailwind.css'
import 'nprogress/nprogress.css'

import type { AppProps } from 'next/app'

import Router from 'next/router'
import NProgress from 'nprogress'

Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
