import { Dialog, Transition } from '@headlessui/react'
import { ExclamationIcon } from '@heroicons/react/solid'
import ko from 'date-fns/locale/ko'
import dayjs from 'dayjs'
import { Fragment, useState } from 'react'
import { DateRange } from 'react-date-range'
import { apiFetchDownload, StoryInfoIdResponse } from '../../api'
import Button from '../button/Button'

interface Props {
  storyInfoId?: StoryInfoIdResponse
  isOpen: boolean
  setIsOpen: (value: boolean) => void
}

export default function CsvDownloadDialog({ storyInfoId, isOpen, setIsOpen }: Props) {
  const minDate = new Date(
    storyInfoId && storyInfoId.stories.length > 0 ? storyInfoId.stories[0].createdAt : new Date()
  )
  const maxDate = new Date(
    storyInfoId && storyInfoId.stories.length > 0 ? storyInfoId.stories.slice(-1)[0].createdAt : new Date()
  )
  const [state, setState] = useState<{ startDate?: Date; endDate?: Date; key?: string }[]>([
    {
      startDate: minDate,
      endDate: maxDate,
      key: 'selection',
    },
  ])

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
                  &quot;{storyInfoId?.storyinfo.title}&quot; 사연 다운로드 (기간)
                </h1>
                {storyInfoId?.stories.find((story) => story.isBanned == null) && (
                  <p className='flex items-center justify-center'>
                    <ExclamationIcon className='h-7 w-6 text-yellow-400' /> 밴 여부 확인이 되지 않은 사연이 있어요.
                  </p>
                )}
                <div className='flex justify-center items-center'>
                  <DateRange
                    locale={ko}
                    editableDateInputs={true}
                    onChange={(item) => setState([item.selection])}
                    moveRangeOnFirstSelection={false}
                    dateDisplayFormat={'yyyy-MM-dd'}
                    monthDisplayFormat={'yyyy년 MM월'}
                    minDate={minDate}
                    maxDate={maxDate}
                    ranges={state}
                  />
                </div>
                <div className='flex gap-2 w-full justify-end'>
                  <Button color='gray-500' hoverColor='gray-600' onClick={() => setIsOpen(false)}>
                    취소
                  </Button>
                  <Button
                    onClick={() => {
                      apiFetchDownload(
                        `/storyinfo/${storyInfoId?.storyinfo.id ?? ''}/download`,
                        `${storyInfoId?.storyinfo.title ?? ''}.csv`,
                        {
                          date: {
                            start: dayjs(state[0].startDate).format('YYYY-MM-DD'),
                            end: dayjs(state[0].endDate).format('YYYY-MM-DD'),
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
