import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useCookies } from 'react-cookie'
import useStorage from '../../hooks/useStorage'

export default function AuthCallback() {
  const router = useRouter()
  const [cookie, _] = useCookies(['token'])
  const { setItem } = useStorage()

  useEffect(() => {
    setItem('token', cookie.token)
    router.push('/')
  }, [router, cookie, setItem])

  return null
}
