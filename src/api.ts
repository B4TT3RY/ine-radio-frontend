// /auth
export interface AuthResponse {
  login: string
  displayName: string
  profileImage: string
  role: Role
}

// /storyinfo
export interface StoryInfoResponse {
  id: string
  title: string
  subTitle?: string
  charCount: number
  onlyFollowers: boolean
  onlySubscribers: boolean
  followDiff: number
  followDiffUnit: string
  maxSubmitCount: number
  currentSubmitCount: number
}

// /storyinfo/new
export interface StoryInfoNewResponse {
  id: string
}

// /storyinfo/list
export interface StoryInfoListResponse {
  id: string
  title: string
  subTitle: string
  charCount: number
  onlyFollowers: boolean
  onlySubscribers: boolean
  activation: boolean
  followDiff: number
  followDiffUnit: number
  createdAt: string
  maxSubmitCount: number
}

// /storyinfo/:id
export interface StoryInfoIdResponse {
  storyinfo: any
  stories: any[]
}

export enum Role {
  ADMIN = 'Admin',
  STREAMER = 'Streamer',
  STAFF = 'Staff',
  USER = 'User',
}

export interface FetcherError {
  code: number
  body: ErrorBody
}

export interface ErrorBody {
  ok: boolean
  error: string
  message: string
}

export const apiFetcher = async (url: string) => {
  if (url == '/storyinfo/undefined') {
    return new Promise(() => undefined)
  }

  const res = await fetch(`http://localhost:3001${url}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  })

  if (!res.ok) {
    const error: FetcherError = {
      code: res.status,
      body: await res.json(),
    }
    throw error
  }

  return res.json()
}

export const apiFetchPost = (url: string, body: any): Promise<Response> => {
  return fetch(`http://localhost:3001${url}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}
