import Link from 'next/link'

export default function LoginButton() {
  return (
    <Link href='/auth/logout'>
      <a className='text-xl text-white cursor-pointer transition-all shadow-lg bg-purple-500 shadow-purple-500/50 hover:bg-purple-600 hover:shadow-purple-600/50 rounded-2xl b-0 p-3'>
        로그아웃
      </a>
    </Link>
  )
}
