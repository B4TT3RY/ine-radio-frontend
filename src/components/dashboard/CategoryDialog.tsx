import { Dialog, Transition } from '@headlessui/react'
import { Field, Form, Formik } from 'formik'
import { Fragment, useRef } from 'react'
import { Category } from '../../api'
import { classNames } from '../../utils'
import Button from '../button/Button'

interface Props {
  isEdit: boolean
  initialValues: Category
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  onAppend: (value: Category) => void
  onDelete?: (name: string) => void
}

export default function CategoryDialog({ isEdit, initialValues, isOpen, setIsOpen, onAppend, onDelete }: Props) {
  const nameRef = useRef<HTMLInputElement>(null)
  const charCountRef = useRef<HTMLInputElement>(null)
  const maxSubmitCountRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

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
            <Dialog.Overlay className='fixed inset-0 bg-black/50' />
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
            <div className='relative bg-white rounded-2xl max-w-sm mx-auto px-4 py-3'>
              <h1 className='text-2xl font-bold mb-3 select-none'>카테고리 {isEdit ? '수정' : '추가'}</h1>
              <div className='space-y-2'>
                <div className='flex flex-col'>
                  <label htmlFor='name' className='text-lg select-none after:content-["_*"] after:text-red-600'>
                    이름
                  </label>
                  <input
                    type='text'
                    id='name'
                    ref={nameRef}
                    required={true}
                    placeholder='카테고리 이름을 입력하세요'
                    defaultValue={initialValues.name}
                    disabled={isEdit}
                    className={classNames(
                      'text-base px-3 py-2 transition-all shadow-sm rounded-2xl w-full',
                      'focus:ring-purple-500 focus:border-purple-500 border border-gray-300',
                      'disabled:text-gray-500 disabled:bg-gray-200'
                    )}
                  />
                </div>
                <div className='flex gap-3'>
                  <div className='flex flex-col flex-1'>
                    <label htmlFor='charCount' className='text-lg select-none after:content-["_*"] after:text-red-600'>
                      글자 수 제한
                    </label>
                    <input
                      type='number'
                      id='charCount'
                      ref={charCountRef}
                      defaultValue={initialValues.charCount}
                      required={true}
                      className={classNames(
                        'text-base px-3 py-2 transition-all shadow-sm rounded-2xl w-full',
                        'focus:ring-purple-500 focus:border-purple-500 border border-gray-300'
                      )}
                    />
                  </div>
                  <div className='flex flex-col flex-1'>
                    <label
                      htmlFor='maxSubmitCount'
                      className='text-lg select-none after:content-["_*"] after:text-red-600'
                    >
                      최대 제출 횟수
                    </label>
                    <input
                      type='number'
                      id='maxSubmitCount'
                      ref={maxSubmitCountRef}
                      defaultValue={initialValues.maxSubmitCount}
                      required={true}
                      className={classNames(
                        'text-base px-3 py-2 transition-all shadow-sm rounded-2xl w-full',
                        'focus:ring-purple-500 focus:border-purple-500 border border-gray-300'
                      )}
                    />
                  </div>
                </div>
                <div className='flex flex-col'>
                  <label htmlFor='description' className='text-lg select-none'>
                    설명
                  </label>
                  <textarea
                    id='description'
                    ref={descriptionRef}
                    rows={2}
                    placeholder='입력 화면에 보일 설명을 입력하세요'
                    defaultValue={initialValues.description}
                    className={classNames(
                      'resize-none w-full text-base px-4 py-3 transition-all shadow-sm rounded-2xl',
                      'focus:ring-purple-500 focus:border-purple-500 border border-gray-300'
                    )}
                  />
                </div>
                <div className='flex gap-2 w-full justify-end'>
                  <Button color='gray-500' hoverColor='gray-600' onClick={() => setIsOpen(false)}>
                    취소
                  </Button>
                  {isEdit && onDelete && (
                    <Button
                      color='red-500'
                      hoverColor='red-600'
                      onClick={() => {
                        onDelete(initialValues.name)
                      }}
                    >
                      삭제
                    </Button>
                  )}
                  <Button
                    color='green-500'
                    hoverColor='green-600'
                    onClick={() => {
                      onAppend({
                        name: nameRef.current?.value ?? '',
                        charCount: parseInt(charCountRef.current?.value ?? '0'),
                        maxSubmitCount: parseInt(maxSubmitCountRef.current?.value ?? '0'),
                        description: descriptionRef.current?.value ?? '',
                      })
                    }}
                  >
                    {isEdit ? '수정' : '추가'}
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
