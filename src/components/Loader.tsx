import { Transition } from '@headlessui/react'
import LoadingSpinner from './LoadingSpinner'

export function Loader({ show }: { show: boolean }) {
  return (
    <Transition
      appear={true}
      show={show}
      enter='transition-opacity duration-200'
      enterFrom='opacity-0'
      enterTo='opacity-100'
      leave='transition-opacity duration-200'
      leaveFrom='opacity-100'
      leaveTo='opacity-0'
    >
      <div className='h-screen w-screen bg-slate-700 flex items-center justify-center'>
        <LoadingSpinner />
      </div>
    </Transition>
  )
}
