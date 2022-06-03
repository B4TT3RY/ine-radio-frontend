import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/solid'
import { Fragment, useState } from 'react'
import { apiFetchDownload, StoryInfoIdResponse } from '../../api'
import { classNames } from '../../utils'
import Button from '../button/Button'

interface Props {
  storyInfoId: StoryInfoIdResponse
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export default function OffsetDownloadDialog({ storyInfoId, isOpen, setIsOpen }: Props) {
  const [startOffset, endOffset] = [storyInfoId.stories[0].id, storyInfoId.stories.slice(-1)[0].id]
  const [offset, setOffset] = useState<{ start: number; end: number }>({
    start: startOffset,
    end: endOffset,
  })

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={() => setIsOpen(false)} className='fixed z-10 inset-0 overflow-y-auto'>
        <div className='flex items-center justify-center min-h-screen'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-black/40 backdrop-blur-sm' />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <div className='relative bg-white rounded-2xl max-w-sm mx-auto p-4 shadow-2xl'>
              <div className='space-y-2'>
                <h1 className='text-2xl font-bold select-none' style={{ wordBreak: 'keep-all' }}>
                  사연 다운로드 (오프셋)
                </h1>
                {storyInfoId.stories.find((story) => story.isBanned == null) && (
                  <p className='flex items-center justify-center'>
                    <ExclamationIcon className='h-7 w-6 text-yellow-400' /> 밴 여부 확인이 되지 않은 사연이 있어요.
                  </p>
                )}
                <div className='flex justify-center items-center gap-3'>
                  <input
                    type='number'
                    className={classNames(
                      'text-base p-3 w-1/2 transition-all shadow-sm rounded-xl',
                      'focus:ring-purple-500 focus:border-purple-500 border border-gray-300'
                    )}
                    min={startOffset}
                    max={offset.end}
                    defaultValue={offset.start}
                    onChange={(e) => setOffset((prev) => ({ start: parseInt(e.target.value), end: prev.end }))}
                  />
                  ~
                  <input
                    type='number'
                    className={classNames(
                      'text-base p-3 w-1/2 transition-all shadow-sm rounded-xl',
                      'focus:ring-purple-500 focus:border-purple-500 border border-gray-300'
                    )}
                    min={offset.start}
                    max={endOffset}
                    defaultValue={offset.end}
                    onChange={(e) => setOffset((prev) => ({ start: prev.start, end: parseInt(e.target.value) }))}
                  />
                </div>
                <div className='flex gap-2 w-full justify-end'>
                  <Button color='gray-500' hoverColor='gray-600' onClick={() => setIsOpen(false)}>
                    취소
                  </Button>
                  <Button
                    onClick={() => {
                      apiFetchDownload(
                        `/storyinfo/${storyInfoId.storyinfo.id ?? ''}/download`,
                        `${storyInfoId.storyinfo.title ?? ''}.csv`,
                        {
                          offset: {
                            start: offset.start,
                            end: offset.end,
                          },
                        }
                      )
                      setIsOpen(false)
                    }}
                  >
                    다운로드
                  </Button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
