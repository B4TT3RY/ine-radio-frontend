import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function AuthLogin() {
  const router = useRouter()

  useEffect(() => {
    router.push('http://localhost:3001/auth/login')
  }, [router])

  return null
}
