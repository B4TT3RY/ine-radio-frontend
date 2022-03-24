import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function DashboardIndex() {
  const router = useRouter()

  useEffect(() => {
    router.push('/dashboard/story')
  }, [router])

  return null
}
