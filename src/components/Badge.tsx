import { classNames } from '../utils'

interface Props {
  children: React.ReactNode
  color?: string
  textColor?: string
  extraClassName?: string
  small?: boolean
}

export default function Badge({ children, color, textColor, extraClassName, small }: Props) {
  return (
    <span
      className={classNames(
        'select-none shadow-md rounded-2xl',
        small ? 'px-2 py-0.5' : 'px-2.5 py-1',
        textColor ? `text-${textColor}` : 'text-white',
        color ? `bg-${color} shadow-${color}/50` : 'bg-purple-500 shadow-purple-500/50',
        extraClassName ?? ''
      )}
    >
      {children}
    </span>
  )
}
