import { classNames } from '../utils'

interface Props {
  children: React.ReactNode
  color?: string
  textColor?: string
  extraClassName?: string
}

export default function Button({ children, color, textColor, extraClassName }: Props) {
  return (
    <span
      className={classNames(
        'select-none shadow-md px-2.5 py-1 rounded-2xl',
        textColor ? `text-${textColor}` : 'text-white',
        color ? `bg-${color} shadow-${color}/50` : 'bg-purple-500 shadow-purple-500/50',
        extraClassName ?? ''
      )}
    >
      {children}
    </span>
  )
}
