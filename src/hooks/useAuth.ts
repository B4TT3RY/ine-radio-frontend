import useSWR from 'swr'
import { apiFetcher, AuthResponse, FetcherError } from '../api'

type UseAuthReturnValue = [AuthResponse | undefined, FetcherError | undefined]

const useAuth = (): UseAuthReturnValue => {
  const { data: auth, error: authError } = useSWR<AuthResponse, FetcherError>('/auth', apiFetcher, {
    revalidateOnFocus: false,
  })

  return [auth, authError]
}

export default useAuth
