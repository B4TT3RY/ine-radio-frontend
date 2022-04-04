import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='ko' className='p-safe h-screen-safe'>
      <Head>
        <BaseMeta />
      </Head>
      <body className='h-screen-safe'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

function BaseMeta() {
  return (
    <>
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover, minimal-ui' />
      <meta name='description' content='아이네의 깃털 라디오에 사연을 보낼 수 있어요.' />
      <meta name='og:type' content='website' />
      <meta name='og:url' content='https://ine-radio.isegye.xyz/' />
      <meta name='og:title' content='아이네의 깃털 라디오' />
      <meta name='og:image' content='/og_image.jpg' />
      <meta name='og:description' content='아이네의 깃털 라디오에 사연을 보낼 수 있어요.' />
      <meta name='og:site_name' content='아이네의 깃털 라디오' />
      <meta name='og:locale' content='ko_KR' />
    </>
  )
}
