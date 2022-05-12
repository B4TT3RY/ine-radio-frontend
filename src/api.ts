// /auth, /user/list
export interface AuthResponse {
  id: number
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
  category: Category[]
  onlyFollowers: boolean
  onlySubscribers: boolean
  followDiff: number
  followDiffUnit: string
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
}

// /storyinfo/:id
export interface StoryInfoIdResponse {
  storyinfo: {
    id: string
    title: string
    subTitle: string
    category: Category[]
    charCount: number
    onlyFollowers: boolean
    onlySubscribers: boolean
    activation: boolean
    followDiff: number
    followDiffUnit: string
    createdAt: string
  }
  stories: {
    id: number
    content: string
    category: string
    favorite: boolean
    isBanned: boolean
    createdAt: string
  }[]
}

// /storyDetail/:id
export interface StoryDetailResponse {
  id: number
  login: string
  displayName: string
  category: string
  content: string
  isBanned?: boolean
  createdAt: Date
}

// /ban/list
export interface BanListResponse {
  id: string
  createdAt: Date
}

// /ban/id
export interface BanDetailResponse {
  user: {
    id: string,
    createdAt: Date,
  },
  stories: {
    id: number,
    content: string,
    createdAt: string
  }[]
}

export enum Role {
  ADMIN = 'Admin',
  STREAMER = 'Streamer',
  STAFF = 'Staff',
  USER = 'User',
}

export interface Category {
  name: string,
  charCount: number,
  currentSubmitCount?: number,
  maxSubmitCount: number,
  description: string,
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
  if (url.includes('undefined')) {
    return new Promise(() => undefined)
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
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

export const apiFetchGet = (url: string): Promise<Response> => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
  })
}

export const apiFetchPost = (url: string, body: any): Promise<Response> => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export const apiFetchPut = (url: string, body: any): Promise<Response> => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export const apiFetchDelete = (url: string, body?: any): Promise<Response> => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}

export const apiFetchDownload = (url: string, fileName: string, body?: any) => {
  fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
    .then((res) => res.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      window.URL.revokeObjectURL(url)
    })
}
