import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useStorage from '../../hooks/useStorage'

export default function AuthLogout() {
  const router = useRouter()
  const { removeItem } = useStorage()

  useEffect(() => {
    removeItem('token')
    router.push('/')
  }, [router, removeItem])

  return null
}
