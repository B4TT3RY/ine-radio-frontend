interface Props {
  type?: 'anonymous' | 'onlyFollowers' | 'onlySubscribers'
  enabled?: boolean
  title?: string
}

export default function Badge({ type, enabled, title: propsTitle }: Props) {
  let title = ''
  let className = ''
  switch (type) {
    case 'anonymous':
      title = '익명'
      className = 'bg-gray-500 shadow-gray-500/50'
      break
    case 'onlyFollowers':
      title = '팔로워 전용'
      className = 'bg-purple-500 shadow-purple-500/50'
      break
    case 'onlySubscribers':
      title = '구독자 전용'
      className = 'bg-purple-500 shadow-purple-500/50'
      break
    default:
      title = propsTitle ?? ''
      className = 'bg-purple-500 shadow-purple-500/50'
      break;
  }

  if (enabled !== undefined) {
    className = enabled ? 'bg-lime-500 shadow-lime-500/50' : 'bg-red-500 shadow-red-500/50'
  }

  return <span className={`shadow-md ${className} text-white px-2.5 py-1 rounded-2xl`}>{title}</span>
}
