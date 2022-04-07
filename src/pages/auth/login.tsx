import { useRouter } from 'next/router'
import { useEffect } from 'react'
import LoadingSpinner from '../../components/LoadingSpinner'

export default function AuthLogin() {
  const router = useRouter()

  useEffect(() => {
    router.push('https://d1c26dab.isegye.xyz/auth/login')
  }, [router])

  return (
    <div className='h-screen flex items-center justify-center'>
      <LoadingSpinner className='w-32 h-32' />
    </div>
  )
}
