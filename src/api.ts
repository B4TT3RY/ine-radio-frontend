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

// {
//   "id": "05b889f5-ce38-44ea-8b8f-bbb45697cdc6",
//   "title": "API 서버 테스트",
//   "sub_title": "새로운 API 서버를 테스트하는 사연입니다.",
//   "char_count": 40,
//   "only_followers": true,
//   "only_subscribers": false,
//   "activation": true,
//   "follow_diff": 0,
//   "follow_diff_unit": "시간",
//   "created_at": "2022-03-20T14:44:43.578896+00:00",
//   "max_submit_count": 1
// }

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
  ADMIN,
  STREAMER,
  STAFF,
  USER,
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
