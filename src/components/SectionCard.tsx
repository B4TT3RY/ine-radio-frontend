import { CheckIcon, ExclamationIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/react/outline'
import LoadingSpinner from './LoadingSpinner'

interface Props {
  type?: 'info' | 'success' | 'warning' | 'error' | 'loading' | undefined
  title?: string | undefined
  subTitle?: string | null | undefined
  children?: React.ReactNode | undefined
}

export default function SectionCard({ type, title, subTitle, children }: Props) {
  const baseClass = 'h-12 w-12'

  return (
    <>
      {type === 'info' && <InformationCircleIcon className={`text-blue-400 ${baseClass}`} />}
      {type === 'success' && <CheckIcon className={`text-green-500 ${baseClass}`} />}
      {type === 'warning' && <ExclamationIcon className={`text-amber-400 ${baseClass}`} />}
      {type === 'error' && <ExclamationCircleIcon className={`text-red-600 ${baseClass}`} />}
      {type === 'loading' && <LoadingSpinner className={baseClass} />}

      {title && (
        <h1
          className='font-semibold text-xl md:text-2xl text-center m-0 text-black dark:text-white'
          style={{ wordBreak: 'keep-all' }}
        >
          {title}
        </h1>
      )}
      {subTitle && (
        <p className='text-center m-0 text-black dark:text-white' style={{ wordBreak: 'keep-all' }}>
          {subTitle}
        </p>
      )}
      {children}
    </>
  )
}