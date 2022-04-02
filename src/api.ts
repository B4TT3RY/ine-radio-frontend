// /auth, /auth/getUsers
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
  storyinfo: {
    id: string
    title: string
    subTitle: string
    charCount: number
    onlyFollowers: boolean
    onlySubscribers: boolean
    activation: boolean
    followDiff: number
    followDiffUnit: string
    createdAt: string
    maxSubmitCount: number
  }
  stories: {
    id: number
    content: string
    favorite: boolean
    createdAt: string
  }[]
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
  if (url.includes('undefined')) {
    return new Promise(() => undefined)
  }

  const res = await fetch(`https://v5yz308m.isegye.xyz${url}`, {
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
  return fetch(`https://v5yz308m.isegye.xyz${url}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

export const apiFetchPut = (url: string, body: any): Promise<Response> => {
  return fetch(`https://v5yz308m.isegye.xyz${url}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

// apiFetchDownload(`/storyinfo/${id}/download`, `${id}.csv`)
export const apiFetchDownload = (url: string, fileName: string) => {
  fetch(`https://v5yz308m.isegye.xyz${url}`, {
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem('token')}`,
    },
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
