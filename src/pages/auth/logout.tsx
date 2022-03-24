import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSWRConfig } from 'swr'
import useStorage from '../../hooks/useStorage'

export default function AuthLogout() {
  const router = useRouter()
  const { removeItem } = useStorage()
  const { mutate } = useSWRConfig()

  useEffect(() => {
    removeItem('token')
    router.push('/')
    mutate('/auth')
  }, [router, removeItem, mutate])

  return null
}
