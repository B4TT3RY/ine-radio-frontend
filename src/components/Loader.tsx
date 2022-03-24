import { Transition } from '@headlessui/react'
import LoadingSpinner from './LoadingSpinner'

export function Loader({ className }: { className?: string }) {
  return (
    <Transition
      appear={true}
      show={true}
      enter='transition-opacity duration-200'
      enterFrom='opacity-0'
      enterTo='opacity-100'
      leave='transition-opacity duration-200'
      leaveFrom='opacity-100'
      leaveTo='opacity-0'
    >
      <div className={`h-screen w-screen flex items-center justify-center${className ? ` ${className}` : ''}`}>
        <LoadingSpinner className='w-32 h-32' />
      </div>
    </Transition>
  )
}
