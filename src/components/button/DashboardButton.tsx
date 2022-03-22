import Link from 'next/link'

export default function DashboardButton() {
  return (
    <Link href='/dashboard'>
      <a className='text-xl text-white select-none transition-all shadow-lg bg-purple-500 shadow-purple-500/50 hover:bg-purple-600 hover:shadow-purple-600/50 rounded-2xl b-0 p-3'>
        대시보드
      </a>
    </Link>
  )
}
