import { PlusIcon } from '@heroicons/react/outline'
import { Field, Form, Formik, FormikHelpers } from 'formik'
import { useState } from 'react'
import { Category } from '../../api'
import { classNames } from '../../utils'
import Button from '../button/Button'
import Markdown from '../Markdown'
import CategoryDialog from './CategoryDialog'

interface Props {
  initialValues: FormValues
  isEditPage: boolean
  onSubmit: (values: FormValues, actions: FormikHelpers<FormValues>) => void | Promise<void>
  onDelete?: () => void | Promise<void>
}

export interface FormValues {
  title: string
  subTitle: string
  category: Category[]
  charCount: number
  activation: boolean
  followDiff: number
  followDiffUnit: string
  isOnlyFollowers: boolean
  isOnlySubscribers: boolean
}

export default function StoryInfoForm({ initialValues, isEditPage, onSubmit, onDelete }: Props) {
  const [categoryDialogIsOpen, setCategoryDialogIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [categoryValues, setCategoryValues] = useState<Category>({
    name: '',
    charCount: 40,
    maxSubmitCount: 1,
    description: '',
  })
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ isSubmitting, values, setFieldValue }) => (
        <Form>
          <fieldset disabled={isSubmitting} className='flex flex-col gap-3'>
            <div className='flex flex-col'>
              <label htmlFor='title' className='text-lg select-none after:content-["_*"] after:text-red-600'>
                제목
              </label>
              <Field
                type='text'
                id='title'
                name='title'
                className={classNames(
                  'text-base px-3 py-2 transition-all shadow-sm rounded-2xl',
                  'focus:ring-purple-500 focus:border-purple-500 border border-gray-300'
                )}
                required
              />
            </div>
            <div className='flex gap-3'>
              <div className='flex flex-col flex-1'>
                <label htmlFor='subTitle' className='text-lg select-none'>
                  설명
                </label>
                <Field
                  as='textarea'
                  id='subTitle'
                  name='subTitle'
                  rows={6}
                  className={classNames(
                    'resize-none w-full text-base px-4 py-3 transition-all shadow-sm rounded-2xl',
                    'focus:ring-purple-500 focus:border-purple-500 border border-gray-300'
                  )}
                />
              </div>
              <div className='flex flex-col flex-1'>
                <label htmlFor='subTitlePreview' className='text-lg select-none'>
                  미리보기
                </label>
                <div
                  id='subTitlePreview'
                  className={classNames(
                    'h-[10.5rem] w-full text-base text-center px-4 py-3 shadow-sm rounded-2xl overflow-auto',
                    'bg-white dark:bg-slate-700 border border-gray-300'
                  )}
                >
                  <Markdown>{values.subTitle}</Markdown>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor='category' className='text-lg select-none after:content-["_*"] after:text-red-600'>
                카테고리
              </label>
              <div className='flex gap-3'>
                <CategoryDialog
                  isEdit={isEdit}
                  initialValues={categoryValues}
                  isOpen={categoryDialogIsOpen}
                  setIsOpen={(value) => setCategoryDialogIsOpen(value)}
                  onAppend={(value) => {
                    if (!value.name || !value.charCount || !value.maxSubmitCount) {
                      alert('입력이 덜 된 필드가 있어요. 다시 확인 해주세요.')
                      return
                    }
                    if (isEdit) {
                      setFieldValue(
                        'category',
                        values.category.map((c) => {
                          if (c.name == value.name) {
                            c = value
                          }
                          return c
                        })
                      )
                    } else {
                      setFieldValue('category', [...values.category, value])
                    }
                    setCategoryDialogIsOpen(false)
                  }}
                  onDelete={(value) => {
                    const answer = confirm(`"${value}" 카테고리를 삭제하시겠어요?`)
                    if (answer) {
                      setFieldValue(
                        'category',
                        values.category.filter((c) => c.name !== value)
                      )
                      setCategoryDialogIsOpen(false)
                    }
                  }}
                />
                <div
                  id='subTitlePreview'
                  className={classNames(
                    'h-full w-full grid grid-cols-1 md:grid-cols-3 gap-3 p-3 shadow-sm rounded-2xl overflow-auto',
                    'bg-white border border-gray-300'
                  )}
                >
                  {values.category.map((c) => (
                    <div
                      key={c.name}
                      className={classNames(
                        'transition-all shadow-sm rounded-2xl px-4 py-3 cursor-pointer',
                        'border border-gray-300 hover:border-gray-600'
                      )}
                      onClick={() => {
                        setIsEdit(true)
                        setCategoryValues(c)
                        setCategoryDialogIsOpen(true)
                      }}
                    >
                      <h1 className='text-xl font-bold'>
                        {c.name}{' '}
                        <span className='text-base font-normal'>
                          {c.charCount}자 | {c.maxSubmitCount}개 제출
                        </span>
                      </h1>
                      <p className='truncate'>{c.description ? c.description : '설명 없음'}</p>
                    </div>
                  ))}
                  <div
                    onClick={() => {
                      setIsEdit(false)
                      setCategoryValues({ name: '', charCount: 40, maxSubmitCount: 1, description: '' })
                      setCategoryDialogIsOpen(true)
                    }}
                    className={classNames(
                      'group flex items-center justify-center h-[4.5rem] cursor-pointer',
                      'rounded-2xl border-4 border-dashed border-gray-400 hover:border-gray-500'
                    )}
                  >
                    <PlusIcon className='w-12 h-12 text-gray-400 group-hover:text-gray-500' />
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-3'>
              <div className='flex flex-col w-full select-none'>
                <div className='flex items-center gap-2'>
                  <Field
                    type='checkbox'
                    id='isOnlyFollowers'
                    name='isOnlyFollowers'
                    className='w-5 h-5 text-violet-600 focus:ring-violet-600 focus:ring-opacity-25 border border-gray-300 rounded'
                  />
                  <label htmlFor='isOnlyFollowers' className='text-lg'>
                    팔로워 전용
                  </label>
                </div>
                {values.isOnlyFollowers && (
                  <div className='mt-1.5'>
                    <span>팔로우한지 </span>
                    <Field
                      type='number'
                      name='followDiff'
                      className={classNames(
                        'text-base px-3 py-2 w-20 transition-all shadow-sm rounded-xl',
                        'focus:ring-purple-500 focus:border-purple-500 border border-gray-300'
                      )}
                      min={0}
                    />
                    <Field
                      as='select'
                      name='followDiffUnit'
                      className={classNames(
                        'text-base ml-1 px-3 py-2 w-20 transition-all shadow-sm rounded-xl',
                        'focus:ring-purple-500 focus:border-purple-500 border border-gray-300'
                      )}
                    >
                      <option value='minutes'>분</option>
                      <option value='hours'>시간</option>
                      <option value='days'>일</option>
                      <option value='months'>개월</option>
                      <option value='years'>년</option>
                    </Field>
                    <span className='ml-1'>이 지난 사람만 허용</span>
                  </div>
                )}
              </div>
              <div className='flex flex-col w-full'>
                <div className='flex items-center gap-2'>
                  <Field
                    type='checkbox'
                    id='isOnlySubscribers'
                    name='isOnlySubscribers'
                    className='w-5 h-5 text-violet-600 focus:ring-violet-600 focus:ring-opacity-25 border border-gray-300 rounded'
                  />
                  <label htmlFor='isOnlySubscribers' className='text-lg select-none'>
                    구독자 전용
                  </label>
                </div>
              </div>
              {isEditPage && (
                <div className='flex flex-col w-full'>
                  <div className='flex items-center gap-2'>
                    <Field
                      type='checkbox'
                      id='activation'
                      name='activation'
                      className='w-5 h-5 text-violet-600 focus:ring-violet-600 focus:ring-opacity-25 border border-gray-300 rounded'
                    />
                    <label htmlFor='activation' className='text-lg select-none'>
                      사연 활성화
                    </label>
                  </div>
                </div>
              )}
            </div>
            <div className='flex gap-3 justify-end'>
              {isEditPage && (
                <Button color='red-500' hoverColor='red-600' extraClassName='text-xl' onClick={onDelete}>
                  사연 삭제
                </Button>
              )}
              <button
                type='submit'
                className={classNames(
                  'text-xl select-none text-white transition-all shadow-lg rounded-2xl b-0 px-3 py-2',
                  'bg-purple-500 shadow-purple-500/50 hover:bg-purple-600 hover:shadow-purple-600/50'
                )}
              >
                {isSubmitting ? `${isEditPage ? '수정' : '생성'}하는 중...` : isEditPage ? '수정' : '생성'}
              </button>
            </div>
          </fieldset>
        </Form>
      )}
    </Formik>
  )
}
