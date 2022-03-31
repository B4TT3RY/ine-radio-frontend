import { classNames } from '../../utils'

interface Props {
  children: React.ReactNode
  color?: string
  textColor?: string
  hoverColor?: string
  extraClassName?: string
  onClick?: () => void
}

export default function Button({ children, color, textColor, hoverColor, extraClassName, onClick }: Props) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={classNames(
        'select-none shadow-md px-2.5 py-1 rounded-2xl',
        textColor ? `text-${textColor}` : 'text-white',
        color ? `bg-${color} shadow-${color}/50` : 'bg-purple-500 shadow-purple-500/50',
        hoverColor ? `hover:bg-${hoverColor} hover:shadow-${hoverColor}/50` : 'hover:bg-purple-600 hover:shadow-purple-600/50',
        extraClassName ?? ''
      )}
    >
      {children}
    </button>
  )
}
